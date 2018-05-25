const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Event` (`EventId` INTEGER NOT NULL, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`EventId`));";
  db.run(sql);
});

class Event {
  static all(cb) {
    const sql = "SELECT EventId AS 'Event ID', Name FROM Event";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO Event (Name) VALUES (?)";
    db.run(sql, data.Name, cb);
  }
}

module.exports.Event = Event;
