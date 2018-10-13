module.exports = function (sequelize, DataTypes) {
  // makes a basic characters table in game database
  var Saveddata = sequelize.define("Saveddata", {
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Saveddata.associate = function (models) {
    Saveddata.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Saveddata;
};