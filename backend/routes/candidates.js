const express = require('express');
const { Op } = require('sequelize');
const { Candidate, Interview, RecruiterAction } = require('../models');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/candidates
 * @desc    Get all candidates with filtering and pagination
 * @access  Private (Recruiters only)
 */
router.get('/', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      skills,
      minExperience,
      maxExperience,
      minScore,
      search
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause for filtering
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (minExperience || maxExperience) {
      whereClause.experience = {};
      if (minExperience) whereClause.experience[Op.gte] = parseInt(minExperience);
      if (maxExperience) whereClause.experience[Op.lte] = parseInt(maxExperience);
    }
    
    if (minScore) {
      whereClause.overallScore = { [Op.gte]: parseFloat(minScore) };
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { education: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: candidates } = await Candidate.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Interview,
          as: 'interviews',
          attributes: ['id', 'status', 'overallScore', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Filter by skills if provided (JSON field filtering)
    let filteredCandidates = candidates;
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      filteredCandidates = candidates.filter(candidate => {
        const candidateSkills = candidate.skills.map(s => s.toLowerCase());
        return skillsArray.some(skill => candidateSkills.includes(skill));
      });
    }

    res.json({
      candidates: filteredCandidates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidates',
      message: 'An error occurred while fetching candidates'
    });
  }
});

/**
 * @route   GET /api/candidates/top
 * @desc    Get top-scoring candidates
 * @access  Private (Recruiters only)
 */
router.get('/top', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCandidates = await Candidate.findAll({
      where: {
        overallScore: { [Op.not]: null }
      },
      order: [['overallScore', 'DESC']],
      limit: parseInt(limit),
      include: [
        {
          model: Interview,
          as: 'interviews',
          attributes: ['id', 'status', 'overallScore']
        }
      ]
    });

    res.json({
      candidates: topCandidates
    });

  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({
      error: 'Failed to fetch top candidates',
      message: 'An error occurred while fetching top candidates'
    });
  }
});

/**
 * @route   GET /api/candidates/:id
 * @desc    Get candidate by ID
 * @access  Private (Recruiters only)
 */
router.get('/:id', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByPk(id, {
      include: [
        {
          model: Interview,
          as: 'interviews',
          order: [['createdAt', 'DESC']]
        },
        {
          model: RecruiterAction,
          as: 'actions',
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The requested candidate does not exist'
      });
    }

    // Log recruiter action
    await RecruiterAction.create({
      recruiterId: req.user.id,
      candidateId: id,
      actionType: 'viewed_candidate'
    });

    res.json({
      candidate
    });

  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate',
      message: 'An error occurred while fetching candidate details'
    });
  }
});

/**
 * @route   POST /api/candidates
 * @desc    Create a new candidate
 * @access  Private (Recruiters only)
 */
router.post('/', authenticateToken, requireRecruiter, validate(schemas.candidateCreate), async (req, res) => {
  try {
    const candidateData = req.validatedData;

    // Check if candidate with email already exists
    const existingCandidate = await Candidate.findOne({
      where: { email: candidateData.email }
    });

    if (existingCandidate) {
      return res.status(400).json({
        error: 'Candidate already exists',
        message: 'A candidate with this email already exists'
      });
    }

    const candidate = await Candidate.create(candidateData);

    // Log recruiter action
    await RecruiterAction.create({
      recruiterId: req.user.id,
      candidateId: candidate.id,
      actionType: 'shortlisted',
      notes: 'Candidate added to system'
    });

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });

  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      error: 'Failed to create candidate',
      message: 'An error occurred while creating the candidate'
    });
  }
});

/**
 * @route   PUT /api/candidates/:id
 * @desc    Update candidate information
 * @access  Private (Recruiters only)
 */
router.put('/:id', authenticateToken, requireRecruiter, validate(schemas.candidateUpdate), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;

    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The requested candidate does not exist'
      });
    }

    const oldStatus = candidate.status;
    await candidate.update(updateData);

    // Log recruiter action if status changed
    if (updateData.status && updateData.status !== oldStatus) {
      await RecruiterAction.create({
        recruiterId: req.user.id,
        candidateId: id,
        actionType: 'updated_status',
        notes: `Status changed from ${oldStatus} to ${updateData.status}`,
        metadata: { oldStatus, newStatus: updateData.status }
      });
    }

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });

  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({
      error: 'Failed to update candidate',
      message: 'An error occurred while updating the candidate'
    });
  }
});

/**
 * @route   DELETE /api/candidates/:id
 * @desc    Delete candidate (soft delete by setting status to rejected)
 * @access  Private (Recruiters only)
 */
router.delete('/:id', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The requested candidate does not exist'
      });
    }

    // Soft delete by setting status to rejected
    await candidate.update({ status: 'rejected' });

    // Log recruiter action
    await RecruiterAction.create({
      recruiterId: req.user.id,
      candidateId: id,
      actionType: 'rejected',
      notes: 'Candidate removed from system'
    });

    res.json({
      message: 'Candidate removed successfully'
    });

  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({
      error: 'Failed to remove candidate',
      message: 'An error occurred while removing the candidate'
    });
  }
});

/**
 * @route   POST /api/candidates/:id/notes
 * @desc    Add notes to candidate
 * @access  Private (Recruiters only)
 */
router.post('/:id/notes', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({
        error: 'Notes required',
        message: 'Please provide notes content'
      });
    }

    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The requested candidate does not exist'
      });
    }

    // Log recruiter action with notes
    await RecruiterAction.create({
      recruiterId: req.user.id,
      candidateId: id,
      actionType: 'added_notes',
      notes: notes.trim()
    });

    res.json({
      message: 'Notes added successfully'
    });

  } catch (error) {
    console.error('Add notes error:', error);
    res.status(500).json({
      error: 'Failed to add notes',
      message: 'An error occurred while adding notes'
    });
  }
});

module.exports = router;
