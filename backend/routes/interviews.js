const express = require('express');
const { Interview, Candidate } = require('../models');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const aiService = require('../services/aiService');

const router = express.Router();

/**
 * @route   GET /api/interviews
 * @desc    Get all interviews with filtering
 * @access  Private (Recruiters only)
 */
router.get('/', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { status, candidateId, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (status) whereClause.status = status;
    if (candidateId) whereClause.candidateId = candidateId;

    const { count, rows: interviews } = await Interview.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'name', 'email', 'skills', 'experience']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      interviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      error: 'Failed to fetch interviews',
      message: 'An error occurred while fetching interviews'
    });
  }
});

/**
 * @route   GET /api/interviews/:id
 * @desc    Get interview by ID
 * @access  Private (Recruiters only)
 */
router.get('/:id', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findByPk(id, {
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'name', 'email', 'skills', 'experience', 'education']
        }
      ]
    });

    if (!interview) {
      return res.status(404).json({
        error: 'Interview not found',
        message: 'The requested interview does not exist'
      });
    }

    res.json({
      interview
    });

  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({
      error: 'Failed to fetch interview',
      message: 'An error occurred while fetching interview details'
    });
  }
});

/**
 * @route   POST /api/interviews
 * @desc    Create a new AI interview for a candidate
 * @access  Private (Recruiters only)
 */
router.post('/', authenticateToken, requireRecruiter, validate(schemas.interviewCreate), async (req, res) => {
  try {
    const { candidateId, interviewType, scheduledAt } = req.validatedData;

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        message: 'The specified candidate does not exist'
      });
    }

    // Generate AI interview questions based on candidate profile
    const questions = await aiService.generateInterviewQuestions(candidate, interviewType);

    const interview = await Interview.create({
      candidateId,
      questions,
      answers: [],
      scores: [],
      status: 'pending',
      interviewType,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null
    });

    res.status(201).json({
      message: 'Interview created successfully',
      interview: {
        ...interview.toJSON(),
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email
        }
      }
    });

  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      error: 'Failed to create interview',
      message: 'An error occurred while creating the interview'
    });
  }
});

/**
 * @route   POST /api/interviews/:id/start
 * @desc    Start an interview (change status to in_progress)
 * @access  Private
 */
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findByPk(id, {
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!interview) {
      return res.status(404).json({
        error: 'Interview not found',
        message: 'The requested interview does not exist'
      });
    }

    if (interview.status !== 'pending') {
      return res.status(400).json({
        error: 'Invalid interview status',
        message: 'Interview can only be started if it is in pending status'
      });
    }

    await interview.update({ 
      status: 'in_progress',
      scheduledAt: new Date()
    });

    res.json({
      message: 'Interview started successfully',
      interview
    });

  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      error: 'Failed to start interview',
      message: 'An error occurred while starting the interview'
    });
  }
});

/**
 * @route   POST /api/interviews/:id/answer
 * @desc    Submit answer to interview question
 * @access  Private
 */
router.post('/:id/answer', authenticateToken, validate(schemas.interviewAnswer), async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, answer } = req.validatedData;

    const interview = await Interview.findByPk(id, {
      include: [
        {
          model: Candidate,
          as: 'candidate'
        }
      ]
    });

    if (!interview) {
      return res.status(404).json({
        error: 'Interview not found',
        message: 'The requested interview does not exist'
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        error: 'Interview already completed',
        message: 'Cannot submit answers to a completed interview'
      });
    }

    if (questionIndex >= interview.questions.length) {
      return res.status(400).json({
        error: 'Invalid question index',
        message: 'Question index is out of range'
      });
    }

    // Update answers array
    const answers = [...interview.answers];
    answers[questionIndex] = answer;

    // Generate AI score for the answer
    const question = interview.questions[questionIndex];
    const score = await aiService.scoreAnswer(question, answer, interview.candidate);

    // Update scores array
    const scores = [...interview.scores];
    scores[questionIndex] = score;

    await interview.update({
      answers,
      scores,
      status: 'in_progress'
    });

    res.json({
      message: 'Answer submitted successfully',
      score,
      nextQuestion: questionIndex + 1 < interview.questions.length 
        ? interview.questions[questionIndex + 1] 
        : null
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      error: 'Failed to submit answer',
      message: 'An error occurred while submitting the answer'
    });
  }
});

/**
 * @route   POST /api/interviews/:id/complete
 * @desc    Complete an interview and generate final score
 * @access  Private
 */
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findByPk(id, {
      include: [
        {
          model: Candidate,
          as: 'candidate'
        }
      ]
    });

    if (!interview) {
      return res.status(404).json({
        error: 'Interview not found',
        message: 'The requested interview does not exist'
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        error: 'Interview already completed',
        message: 'This interview has already been completed'
      });
    }

    // Calculate overall score
    const validScores = interview.scores.filter(score => score !== null && score !== undefined);
    const overallScore = validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0;

    // Generate AI feedback
    const feedback = await aiService.generateInterviewFeedback(
      interview.questions,
      interview.answers,
      interview.scores,
      interview.candidate
    );

    // Calculate duration if started
    const duration = interview.scheduledAt 
      ? Math.round((new Date() - new Date(interview.scheduledAt)) / (1000 * 60))
      : null;

    await interview.update({
      status: 'completed',
      overallScore,
      feedback,
      completedAt: new Date(),
      duration
    });

    // Update candidate scores
    const candidate = interview.candidate;
    const technicalScore = Math.min(overallScore + 5, 100);
    const softSkillScore = Math.max(overallScore - 5, 0);

    await candidate.update({
      overallScore,
      technicalScore,
      softSkillScore,
      status: overallScore >= 70 ? 'interview' : 'screening'
    });

    res.json({
      message: 'Interview completed successfully',
      interview: {
        ...interview.toJSON(),
        overallScore,
        feedback
      }
    });

  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      error: 'Failed to complete interview',
      message: 'An error occurred while completing the interview'
    });
  }
});

module.exports = router;
