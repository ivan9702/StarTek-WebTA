const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Entry` (`EntryId` INTEGER NOT NULL, `UserId` INTEGER NOT NULL, `DateTime` DATETIME NOT NULL, `LocationId` INTEGER NOT NULL, PRIMARY KEY (`EntryId`), FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`), FOREIGN KEY (`LocationId`) REFERENCES `Location` (`LocationId`))";
  db.run(sql);
});

class Entry {
  static all(cb) {
    const sql = "SELECT User.UserName AS id, DateTime AS dateTime FROM Entry JOIN User ON Entry.UserId = User.UserId";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO Entry (UserId, DateTime, LocationId) VALUES ( (SELECT UserId FROM User WHERE UserName = ?), ?, (SELECT LocationId FROM Location WHERE IpAddress = ?))";
    db.run(sql, data.userId, data.dateTime, data.ipAddress, cb);
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
    const sql = `SELECT DateTime AS dateTime FROM Entry WHERE${whereClause}`;
    db.all.apply(db, [sql, ...sqlParams]);
  }
}

module.exports.Entry = Entry;
