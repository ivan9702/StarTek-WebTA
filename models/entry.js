'use strict';
module.exports = (sequelize, DataTypes) => {
  var Entry = sequelize.define('Entry', {
    EntryId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    DateTime: DataTypes.DATE
  }, {
    timestamps: false,
    tableName: 'Entry',
    freezeTableName: true
  });
  Entry.associate = function(models) {
    // associations can be defined here
    Entry.belongsTo(models.User, {
      foreignKey: 'UserId'
    });
    Entry.belongsTo(models.Event, {
      foreignKey: 'EventId'
    });
    Entry.belongsTo(models.Location, {
      foreignKey: 'LocationId'
    });
  };
  return Entry;
};
