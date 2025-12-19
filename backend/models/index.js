const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const sequelize = new Sequelize({
  dialect: 'mysql', // Change to 'postgres' if using PostgreSQL
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'hiremind_ai',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const User = require('./User')(sequelize);
const Candidate = require('./Candidate')(sequelize);
const Interview = require('./Interview')(sequelize);
const RecruiterAction = require('./RecruiterAction')(sequelize);
const JobPosting = require('./JobPosting')(sequelize);

// Define associations
User.hasMany(RecruiterAction, { foreignKey: 'recruiterId', as: 'actions' });
RecruiterAction.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

User.hasMany(JobPosting, { foreignKey: 'createdBy', as: 'jobPostings' });
JobPosting.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Candidate.hasMany(Interview, { foreignKey: 'candidateId', as: 'interviews' });
Interview.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

Candidate.hasMany(RecruiterAction, { foreignKey: 'candidateId', as: 'actions' });
RecruiterAction.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

module.exports = {
  sequelize,
  User,
  Candidate,
  Interview,
  RecruiterAction,
  JobPosting
};
