const Joi = require('joi');

// Validation schemas
const schemas = {
  // User registration/login
  userRegistration: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().valid('recruiter', 'candidate').default('recruiter'),
    company: Joi.string().max(100).optional()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Candidate creation/update
  candidateCreate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    experience: Joi.number().integer().min(0).max(50).required(),
    education: Joi.string().max(200).optional(),
    projects: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      technologies: Joi.array().items(Joi.string()).required()
    })).default([]),
    salaryExpectation: Joi.number().integer().min(0).optional(),
    location: Joi.string().max(100).optional()
  }),

  candidateUpdate: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    experience: Joi.number().integer().min(0).max(50).optional(),
    education: Joi.string().max(200).optional(),
    projects: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      technologies: Joi.array().items(Joi.string()).required()
    })).optional(),
    status: Joi.string().valid('applied', 'screening', 'interview', 'hired', 'rejected').optional(),
    salaryExpectation: Joi.number().integer().min(0).optional(),
    location: Joi.string().max(100).optional()
  }),

  // Interview
  interviewCreate: Joi.object({
    candidateId: Joi.string().uuid().required(),
    interviewType: Joi.string().valid('ai_screening', 'technical', 'behavioral', 'final').default('ai_screening'),
    scheduledAt: Joi.date().optional()
  }),

  interviewAnswer: Joi.object({
    questionIndex: Joi.number().integer().min(0).required(),
    answer: Joi.string().min(1).max(5000).required()
  }),

  // Job posting
  jobPostingCreate: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(50).required(),
    requiredSkills: Joi.array().items(Joi.string()).min(1).required(),
    experienceLevel: Joi.string().required(),
    salaryRange: Joi.object({
      min: Joi.number().integer().min(0).required(),
      max: Joi.number().integer().min(0).required()
    }).required(),
    location: Joi.string().required()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Please check your input data',
        details
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  schemas,
  validate
};
