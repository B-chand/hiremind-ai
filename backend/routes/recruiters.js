const express = require('express');
const { Op } = require('sequelize');
const { User, Candidate, Interview, RecruiterAction, JobPosting } = require('../models');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/recruiters/dashboard
 * @desc    Get recruiter dashboard statistics
 * @access  Private (Recruiters only)
 */
router.get('/dashboard', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    // Get basic statistics
    const totalCandidates = await Candidate.count();
    const activeInterviews = await Interview.count({
      where: { status: 'in_progress' }
    });
    const completedInterviews = await Interview.count({
      where: { status: 'completed' }
    });

    // Get average score
    const avgScoreResult = await Candidate.findOne({
      attributes: [
        [Candidate.sequelize.fn('AVG', Candidate.sequelize.col('overallScore')), 'avgScore']
      ],
      where: {
        overallScore: { [Op.not]: null }
      }
    });
    const avgScore = Math.round(avgScoreResult?.dataValues?.avgScore || 0);

    // Get status distribution
    const statusDistribution = await Candidate.findAll({
      attributes: [
        'status',
        [Candidate.sequelize.fn('COUNT', Candidate.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const statusDistributionObj = {};
    statusDistribution.forEach(item => {
      statusDistributionObj[item.status] = parseInt(item.dataValues.count);
    });

    res.json({
      totalCandidates,
      activeInterviews,
      completedInterviews,
      avgScore,
      statusDistribution: statusDistributionObj
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics',
      message: 'An error occurred while fetching dashboard data'
    });
  }
});

/**
 * @route   GET /api/recruiters/analytics/skills
 * @desc    Get skills analytics
 * @access  Private (Recruiters only)
 */
router.get('/analytics/skills', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      attributes: ['skills']
    });

    // Count skill occurrences
    const skillCounts = {};
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase().trim();
        skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const skillsAnalytics = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 skills

    res.json(skillsAnalytics);

  } catch (error) {
    console.error('Skills analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch skills analytics',
      message: 'An error occurred while fetching skills data'
    });
  }
});

/**
 * @route   GET /api/recruiters/analytics/scores
 * @desc    Get score distribution analytics
 * @access  Private (Recruiters only)
 */
router.get('/analytics/scores', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const scoreRanges = [
      { range: '0-20', min: 0, max: 20 },
      { range: '21-40', min: 21, max: 40 },
      { range: '41-60', min: 41, max: 60 },
      { range: '61-80', min: 61, max: 80 },
      { range: '81-100', min: 81, max: 100 }
    ];

    const scoreDistribution = await Promise.all(
      scoreRanges.map(async ({ range, min, max }) => {
        const count = await Candidate.count({
          where: {
            overallScore: {
              [Op.gte]: min,
              [Op.lte]: max
            }
          }
        });
        return { range, count };
      })
    );

    res.json(scoreDistribution);

  } catch (error) {
    console.error('Score analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch score analytics',
      message: 'An error occurred while fetching score data'
    });
  }
});

/**
 * @route   GET /api/recruiters/activity
 * @desc    Get recent recruiter activity
 * @access  Private (Recruiters only)
 */
router.get('/activity', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentActivity = await RecruiterAction.findAll({
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name']
        },
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    // Format activity for frontend
    const formattedActivity = recentActivity.map(action => ({
      id: action.id,
      actionType: action.actionType,
      recruiterName: action.recruiter.name,
      candidateName: action.candidate.name,
      notes: action.notes,
      timestamp: action.createdAt,
      metadata: action.metadata
    }));

    res.json(formattedActivity);

  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch activity',
      message: 'An error occurred while fetching recent activity'
    });
  }
});

/**
 * @route   GET /api/recruiters/job-postings
 * @desc    Get recruiter's job postings
 * @access  Private (Recruiters only)
 */
router.get('/job-postings', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = { createdBy: req.user.id };
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows: jobPostings } = await JobPosting.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      jobPostings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Job postings fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch job postings',
      message: 'An error occurred while fetching job postings'
    });
  }
});

/**
 * @route   GET /api/recruiters/performance
 * @desc    Get recruiter performance metrics
 * @access  Private (Recruiters only)
 */
router.get('/performance', authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get actions in last 30 days
    const recentActions = await RecruiterAction.count({
      where: {
        recruiterId,
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Get candidates reviewed
    const candidatesReviewed = await RecruiterAction.count({
      where: {
        recruiterId,
        actionType: 'viewed_candidate',
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Get interviews scheduled
    const interviewsScheduled = await RecruiterAction.count({
      where: {
        recruiterId,
        actionType: 'scheduled_interview',
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Get offers sent
    const offersSent = await RecruiterAction.count({
      where: {
        recruiterId,
        actionType: 'sent_offer',
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    res.json({
      period: '30 days',
      metrics: {
        totalActions: recentActions,
        candidatesReviewed,
        interviewsScheduled,
        offersSent,
        averageActionsPerDay: Math.round(recentActions / 30)
      }
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      error: 'Failed to fetch performance metrics',
      message: 'An error occurred while fetching performance data'
    });
  }
});

module.exports = router;
