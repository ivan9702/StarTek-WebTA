'use strict';
module.exports = (sequelize, DataTypes) => {
  var Department = sequelize.define('Department', {
    DepartmentId: DataTypes.INTEGER,
    Name: DataTypes.STRING
  }, {});
  Department.associate = function(models) {
    // associations can be defined here
    Department.hasMany(models.User, {
      foreignKey: 'DepartmentId'
    });
  };
  return Department;
};
