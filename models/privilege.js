'use strict';
module.exports = (sequelize, DataTypes) => {
  var Privilege = sequelize.define('Privilege', {
    PrivilegeId: DataTypes.INTEGER,
    Name: DataTypes.STRING
  }, {});
  Privilege.associate = function(models) {
    // associations can be defined here
    Privilege.hasMany(models.User);
  };
  return Privilege;
};
