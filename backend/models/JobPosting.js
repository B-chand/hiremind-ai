const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JobPosting = sequelize.define('JobPosting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    requiredSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salaryRange: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { min: 0, max: 0 }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    applicationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'job_postings',
    timestamps: true,
    indexes: [
      {
        fields: ['createdBy']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['requiredSkills'],
        type: 'FULLTEXT'
      }
    ]
  });

  return JobPosting;
};
