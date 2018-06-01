const { db } = require('./db');

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
