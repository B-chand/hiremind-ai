const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Candidate } = require('../models');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${extension}`);
  }
});

// File filter for resumes
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

/**
 * @route   POST /api/upload/resume
 * @desc    Upload resume file for a candidate
 * @access  Private (Recruiters only)
 */
router.post('/resume', authenticateToken, requireRecruiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a resume file to upload'
      });
    }

    const { candidateId } = req.body;

    if (!candidateId) {
      // Delete uploaded file if no candidate ID provided
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Candidate ID required',
        message: 'Please provide a valid candidate ID'
      });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      // Delete uploaded file if candidate not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Delete old resume file if exists
    if (candidate.resumePath && fs.existsSync(candidate.resumePath)) {
      try {
        fs.unlinkSync(candidate.resumePath);
      } catch (error) {
        console.warn('Failed to delete old resume file:', error.message);
      }
    }

    // Update candidate with new resume path
    await candidate.update({
      resumePath: req.file.path
    });

    // Generate resume URL for frontend access
    const resumeUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Resume uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: resumeUrl
      },
      candidate: {
        id: candidate.id,
        name: candidate.name,
        resumeUrl
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.warn('Failed to delete uploaded file on error:', unlinkError.message);
      }
    }

    console.error('Resume upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Resume file size must be less than 5MB'
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading the resume'
    });
  }
});

/**
 * @route   POST /api/upload/resume-and-parse
 * @desc    Upload resume file and parse it with AI
 * @access  Private (Recruiters only)
 */
router.post('/resume-and-parse', authenticateToken, requireRecruiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a resume file to upload'
      });
    }

    // Parse resume using AI service
    let parsedData;
    try {
      parsedData = await aiService.parseResumeFile(req.file.path);
    } catch (parseError) {
      console.error('Resume parsing error:', parseError);
      // Continue with upload even if parsing fails
      parsedData = {
        error: 'Failed to parse resume automatically',
        message: 'Resume uploaded but automatic parsing failed'
      };
    }

    // If candidateId is provided, update existing candidate
    const { candidateId } = req.body;
    let candidate = null;

    if (candidateId) {
      candidate = await Candidate.findByPk(candidateId);
      if (candidate) {
        // Delete old resume file if exists
        if (candidate.resumePath && fs.existsSync(candidate.resumePath)) {
          try {
            fs.unlinkSync(candidate.resumePath);
          } catch (error) {
            console.warn('Failed to delete old resume file:', error.message);
          }
        }

        await candidate.update({
          resumePath: req.file.path,
          ...(parsedData.name && { name: parsedData.name }),
          ...(parsedData.email && { email: parsedData.email }),
          ...(parsedData.phone && { phone: parsedData.phone }),
          ...(parsedData.skills && { skills: parsedData.skills }),
          ...(parsedData.experience && { experience: parsedData.experience }),
          ...(parsedData.education && { education: parsedData.education }),
          ...(parsedData.projects && { projects: parsedData.projects })
        });
      }
    }

    // Generate resume URL for frontend access
    const resumeUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Resume uploaded and parsed successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: resumeUrl
      },
      parsedData,
      candidate: candidate ? {
        id: candidate.id,
        name: candidate.name,
        resumeUrl
      } : null
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.warn('Failed to delete uploaded file on error:', unlinkError.message);
      }
    }

    console.error('Resume upload and parse error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Resume file size must be less than 5MB'
      });
    }

    res.status(500).json({
      error: 'Upload and parse failed',
      message: 'An error occurred while uploading and parsing the resume'
    });
  }
});

/**
 * @route   DELETE /api/upload/resume/:candidateId
 * @desc    Delete resume file for a candidate
 * @access  Private (Recruiters only)
 */
router.delete('/resume/:candidateId', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    if (!candidate.resumePath) {
      return res.status(400).json({
        error: 'No resume found',
        message: 'This candidate does not have a resume file'
      });
    }

    // Delete resume file
    if (fs.existsSync(candidate.resumePath)) {
      try {
        fs.unlinkSync(candidate.resumePath);
      } catch (error) {
        console.warn('Failed to delete resume file:', error.message);
      }
    }

    // Update candidate to remove resume path
    await candidate.update({
      resumePath: null
    });

    res.json({
      message: 'Resume deleted successfully',
      candidate: {
        id: candidate.id,
        name: candidate.name
      }
    });

  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete resume',
      message: 'An error occurred while deleting the resume'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 5MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file',
        message: 'Only one resume file is allowed'
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF, DOC, DOCX, and TXT files are allowed'
    });
  }

  next(error);
});

module.exports = router;
