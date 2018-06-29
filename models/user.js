'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    UserId: DataTypes.INTEGER,
    UserName: DataTypes.STRING,
    NameString: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Privilege);
    User.belongsTo(models.Department);
    User.hasMany(models.Entry);
  };
  return User;
};
