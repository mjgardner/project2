module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    rating: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    authorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    }
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.Project, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Comment;
};
