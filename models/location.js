const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Location` (`LocationId` INTEGER NOT NULL, `IpAddress` TEXT NOT NULL UNIQUE, PRIMARY KEY (`LocationId`));";
  db.run(sql);
});

class Location {
  static all(cb) {
    const sql = "SELECT LocationId AS 'Location ID', IpAddress AS 'IP Address' FROM Location";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO Location (IpAddress) VALUES (?)";
    db.run(sql, data.Name, cb);
  }
}

module.exports.Location = Location;
