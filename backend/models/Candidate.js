const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Candidate = sequelize.define('Candidate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\+]?[1-9][\d]{0,15}$/
      }
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 50
      }
    },
    education: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projects: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    resumePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('applied', 'screening', 'interview', 'hired', 'rejected'),
      allowNull: false,
      defaultValue: 'applied'
    },
    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    technicalScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    softSkillScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    salaryExpectation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    recommendedSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    availability: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'candidates',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['overallScore']
      },
      {
        fields: ['skills'],
        type: 'FULLTEXT'
      }
    ]
  });

  return Candidate;
};
