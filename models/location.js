'use strict';
module.exports = (sequelize, DataTypes) => {
  var Location = sequelize.define('Location', {
    LocationId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    IpAddress: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'Location',
    freezeTableName: true
  });
  Location.associate = function(models) {
    // associations can be defined here
    Location.hasMany(models.Entry, {
      foreignKey: 'LocationId'
    });
  };
  return Location;
};
