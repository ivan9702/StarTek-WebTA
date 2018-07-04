'use strict';
module.exports = (sequelize, DataTypes) => {
  var Department = sequelize.define('Department', {
    DepartmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'Department',
    freezeTableName: true
  });
  Department.associate = function(models) {
    // associations can be defined here
    Department.hasMany(models.User, {
      foreignKey: 'DepartmentId'
    });
  };
  return Department;
};
