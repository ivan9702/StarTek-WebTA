'use strict';
module.exports = (sequelize, DataTypes) => {
  var Privilege = sequelize.define('Privilege', {
    PrivilegeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'Privilege',
    freezeTableName: true
  });
  Privilege.associate = function(models) {
    // associations can be defined here
    Privilege.hasMany(models.User, {
      foreignKey: 'PrivilegeId'
    });
  };
  return Privilege;
};
