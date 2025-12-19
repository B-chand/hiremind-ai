const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecruiterAction = sequelize.define('RecruiterAction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    recruiterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    actionType: {
      type: DataTypes.ENUM(
        'viewed_candidate',
        'shortlisted',
        'rejected',
        'scheduled_interview',
        'sent_offer',
        'updated_status',
        'added_notes'
      ),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'recruiter_actions',
    timestamps: true,
    indexes: [
      {
        fields: ['recruiterId']
      },
      {
        fields: ['candidateId']
      },
      {
        fields: ['actionType']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return RecruiterAction;
};
