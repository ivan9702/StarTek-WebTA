'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    EventId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING
  }, {
    timestamps: false,
    tableName: 'Event',
    freezeTableName: true
  });
  Event.associate = function(models) {
    // associations can be defined here
    Event.hasMany(models.Entry, {
      foreignKey: 'EventId'
    });
  };
  return Event;
};
