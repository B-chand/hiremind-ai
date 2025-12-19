const express = require('express');
const { Candidate } = require('../models');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

const router = express.Router();

/**
 * @route   POST /api/ai/score-candidate
 * @desc    Generate AI score for a candidate
 * @access  Private (Recruiters only)
 */
router.post('/score-candidate', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateId, jobRequirements } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        error: 'Candidate ID required',
        message: 'Please provide a valid candidate ID'
      });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Generate AI scores
    const scores = await aiService.scoreCandidate(candidate, jobRequirements);

    // Update candidate with new scores
    await candidate.update({
      overallScore: scores.overallScore,
      technicalScore: scores.technicalScore,
      softSkillScore: scores.softSkillScore,
      recommendedSalary: scores.recommendedSalary
    });

    res.json({
      message: 'Candidate scored successfully',
      scores,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        ...scores
      }
    });

  } catch (error) {
    console.error('AI scoring error:', error);
    res.status(500).json({
      error: 'Failed to score candidate',
      message: 'An error occurred while generating AI scores'
    });
  }
});

/**
 * @route   POST /api/ai/parse-resume
 * @desc    Parse resume using AI and extract candidate information
 * @access  Private (Recruiters only)
 */
router.post('/parse-resume', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { resumeText, resumeUrl } = req.body;

    if (!resumeText && !resumeUrl) {
      return res.status(400).json({
        error: 'Resume content required',
        message: 'Please provide either resume text or resume URL'
      });
    }

    // Parse resume using AI
    const parsedData = await aiService.parseResume(resumeText || resumeUrl);

    res.json({
      message: 'Resume parsed successfully',
      parsedData
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      error: 'Failed to parse resume',
      message: 'An error occurred while parsing the resume'
    });
  }
});

/**
 * @route   POST /api/ai/generate-email
 * @desc    Generate AI email for candidate communication
 * @access  Private (Recruiters only)
 */
router.post('/generate-email', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateId, emailType, customContext } = req.body;

    if (!candidateId || !emailType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide candidate ID and email type'
      });
    }

    const validEmailTypes = ['acknowledgment', 'interview_invite', 'rejection', 'offer'];
    if (!validEmailTypes.includes(emailType)) {
      return res.status(400).json({
        error: 'Invalid email type',
        message: `Email type must be one of: ${validEmailTypes.join(', ')}`
      });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Generate email content using AI
    const emailContent = await aiService.generateEmail(candidate, emailType, customContext);

    res.json({
      message: 'Email generated successfully',
      emailContent,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email
      }
    });

  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({
      error: 'Failed to generate email',
      message: 'An error occurred while generating the email'
    });
  }
});

/**
 * @route   POST /api/ai/send-email
 * @desc    Send AI-generated email to candidate
 * @access  Private (Recruiters only)
 */
router.post('/send-email', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateId, subject, content, emailType } = req.body;

    if (!candidateId || !subject || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide candidate ID, subject, and content'
      });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Send email
    const emailResult = await emailService.sendEmail({
      to: candidate.email,
      subject,
      html: content,
      from: req.user.email
    });

    res.json({
      message: 'Email sent successfully',
      emailResult,
      sentTo: candidate.email
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: 'An error occurred while sending the email'
    });
  }
});

/**
 * @route   POST /api/ai/salary-recommendation
 * @desc    Get AI-powered salary recommendation for candidate
 * @access  Private (Recruiters only)
 */
router.post('/salary-recommendation', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateId, jobTitle, location, companySize } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        error: 'Candidate ID required',
        message: 'Please provide a valid candidate ID'
      });
    }

    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Generate salary recommendation using AI
    const salaryRecommendation = await aiService.generateSalaryRecommendation(
      candidate,
      { jobTitle, location, companySize }
    );

    // Update candidate with recommended salary
    await candidate.update({
      recommendedSalary: salaryRecommendation.recommendedSalary
    });

    res.json({
      message: 'Salary recommendation generated successfully',
      salaryRecommendation,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        recommendedSalary: salaryRecommendation.recommendedSalary
      }
    });

  } catch (error) {
    console.error('Salary recommendation error:', error);
    res.status(500).json({
      error: 'Failed to generate salary recommendation',
      message: 'An error occurred while generating salary recommendation'
    });
  }
});

/**
 * @route   POST /api/ai/batch-score
 * @desc    Score multiple candidates in batch
 * @access  Private (Recruiters only)
 */
router.post('/batch-score', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { candidateIds, jobRequirements } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        error: 'Candidate IDs required',
        message: 'Please provide an array of candidate IDs'
      });
    }

    const candidates = await Candidate.findAll({
      where: { id: candidateIds }
    });

    if (candidates.length === 0) {
      return res.status(404).json({
        error: 'No candidates found',
        message: 'None of the specified candidates exist'
      });
    }

    // Score all candidates
    const scoringResults = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          const scores = await aiService.scoreCandidate(candidate, jobRequirements);
          
          // Update candidate with new scores
          await candidate.update({
            overallScore: scores.overallScore,
            technicalScore: scores.technicalScore,
            softSkillScore: scores.softSkillScore,
            recommendedSalary: scores.recommendedSalary
          });

          return {
            candidateId: candidate.id,
            candidateName: candidate.name,
            success: true,
            scores
          };
        } catch (error) {
          return {
            candidateId: candidate.id,
            candidateName: candidate.name,
            success: false,
            error: error.message
          };
        }
      })
    );

    const successCount = scoringResults.filter(result => result.success).length;
    const failureCount = scoringResults.length - successCount;

    res.json({
      message: `Batch scoring completed: ${successCount} successful, ${failureCount} failed`,
      results: scoringResults,
      summary: {
        total: scoringResults.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error) {
    console.error('Batch scoring error:', error);
    res.status(500).json({
      error: 'Failed to score candidates',
      message: 'An error occurred during batch scoring'
    });
  }
});

module.exports = router;
