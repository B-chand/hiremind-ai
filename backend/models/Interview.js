const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Interview = sequelize.define('Interview', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    scores: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    interviewType: {
      type: DataTypes.ENUM('ai_screening', 'technical', 'behavioral', 'final'),
      allowNull: false,
      defaultValue: 'ai_screening'
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    }
  }, {
    tableName: 'interviews',
    timestamps: true,
    indexes: [
      {
        fields: ['candidateId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['interviewType']
      }
    ]
  });

  return Interview;
};
