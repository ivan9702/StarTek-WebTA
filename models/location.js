'use strict';
module.exports = (sequelize, DataTypes) => {
  var Location = sequelize.define('Location', {
    LocationId: DataTypes.INTEGER,
    IpAddress: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};