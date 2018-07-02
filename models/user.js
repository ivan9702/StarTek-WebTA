'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    UserName: DataTypes.STRING,
    NameString: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'User',
    freezeTableName: true
  });
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Privilege);
    User.belongsTo(models.Department);
    User.hasMany(models.Entry);
  };
  return User;
};
