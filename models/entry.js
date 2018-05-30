const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Entry` (`EntryId` INTEGER NOT NULL, `UserId` INTEGER NOT NULL, `DateTime` DATETIME NOT NULL, `LocationId` INTEGER NOT NULL, `EventId` INTEGER, PRIMARY KEY (`EntryId`), FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`), FOREIGN KEY(`EventId`) REFERENCES `Event`(`EventId`), FOREIGN KEY (`LocationId`) REFERENCES `Location` (`LocationId`))";
  db.run(sql);
});

class Entry {
  static all(cb) {
    const sql = "SELECT User.UserName AS id, Entry.DateTime AS dateTime, Location.IpAddress AS location FROM Entry JOIN User JOIN Location ON Entry.UserId = User.UserId AND Entry.LocationId = Location.LocationId";
    db.all(sql, cb);
  }

  static create(data, cb) {
    db.serialize(() => {
      db.run("INSERT OR IGNORE INTO Location (IpAddress) VALUES ( ? )", data.ipAddress);
      db.run("INSERT INTO Entry (UserId, DateTime, LocationId, EventId) VALUES ( (SELECT UserId FROM User WHERE UserName = ?), ?, (SELECT LocationId FROM Location WHERE IpAddress = ?), (SELECT EventId FROM Event WHERE Name = ?))", data.userId, data.dateTime, data.ipAddress, data.event, cb);
    });
  }

  static filter(data, cb) {
    const sqlExp = [];
    let sqlParams = [cb];

    if (data.userId) {
      sqlExp.unshift(` UserId = (SELECT UserId FROM User WHERE UserName = (?)) `);
      sqlParams.unshift(data.userId);
    }
    if (data.dtStart) {
      sqlExp.unshift(` DateTime >= datetime(?) `);
      sqlParams.unshift(`${data.dtStart}`);
    }
    if (data.dtEnd) {
      sqlExp.unshift(` DateTime <= datetime(?) `);
      sqlParams.unshift(`${data.dtEnd}`);
    }

    const whereClause = sqlExp.join('AND');
    const sql = `SELECT DateTime AS dateTime, Location.IpAddress AS location FROM Entry JOIN Location ON Location.LocationId = Entry.LocationId WHERE${whereClause}`;
    db.all.apply(db, [sql, ...sqlParams]);
  }
}

module.exports.Entry = Entry;
