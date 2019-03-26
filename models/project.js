module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define(
    "Project",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      pictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      visits: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          type: "FULLTEXT",
          fields: ["name"]
        },
        {
          type: "FULLTEXT",
          fields: ["description"]
        }
      ]
    }
  );

  Project.associate = function(models) {
    Project.hasMany(models.Comment, {
      onDelete: "cascade"
    });
  };

  return Project;
};
