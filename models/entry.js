'use strict';
module.exports = (sequelize, DataTypes) => {
  var Entry = sequelize.define('Entry', {
    EntryId: DataTypes.INTEGER,
    DateTime: DataTypes.DATE
  }, {});
  Entry.associate = function(models) {
    // associations can be defined here
    Entry.belongsTo(models.User);
    Entry.belongsTo(models.Event);
    Entry.belongsTo(models.Location);
  };
  return Entry;
};
