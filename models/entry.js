const sqlite3 = require('sqlite3').verbose();

const { db } = require('./db');

db.serialize(() => {
  const sqls = [
    "CREATE TABLE IF NOT EXISTS `Privilege` (`PrivilegeId` INTEGER NOT NULL, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`PrivilegeId`))",
    "CREATE TABLE IF NOT EXISTS `Location` (`LocationId` INTEGER NOT NULL, `IpAddress` TEXT NOT NULL UNIQUE, PRIMARY KEY (`LocationId`));",
    "CREATE TABLE IF NOT EXISTS `Department` (`DepartmentId` INTEGER NOT NULL, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`DepartmentId`))",
    "CREATE TABLE IF NOT EXISTS `User` (`UserId` INTEGER NOT NULL, `UserName` TEXT NOT NULL UNIQUE, `DepartmentId` INTEGER, `PrivilegeId` INTEGER NOT NULL, PRIMARY KEY (`UserId`), FOREIGN KEY (`DepartmentId`) REFERENCES `Department` (`DepartmentId`), FOREIGN KEY (`PrivilegeId`) REFERENCES `Privilege` (`PrivilegeId`))",
    "CREATE TABLE IF NOT EXISTS `Entry` (`EntryId` INTEGER NOT NULL, `UserId` INTEGER NOT NULL, `DateTime` DATETIME NOT NULL, `LocationId` INTEGER NOT NULL, PRIMARY KEY (`EntryId`), FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`), FOREIGN KEY (`LocationId`) REFERENCES `Location` (`LocationId`))"
  ];
  sqls.forEach(sql => {
    db.run(sql);
  });
});

class Entry {
  static all(cb) {
    db.all('SELECT * FROM entries', cb);
  }

  static create(data, cb) {
    const sql = 'INSERT INTO entries (id, dateTime) VALUES (?, ?)';
    db.run(sql, data.userId, data.dateTime, cb);
  }

  static filter(data, cb) {
    const sqlExp = [];
    let sqlParams = [cb];

    if (data.userId) {
      sqlExp.unshift(` id = (?) `);
      sqlParams.unshift(data.userId);
    }
    if (data.dtStart) {
      sqlExp.unshift(` dateTime >= datetime(?) `);
      sqlParams.unshift(`${data.dtStart}`);
    }
    if (data.dtEnd) {
      sqlExp.unshift(` dateTime <= datetime(?) `);
      sqlParams.unshift(`${data.dtEnd}`);
    }

    const whereClause = sqlExp.join('AND');
    const sql = `SELECT * FROM entries WHERE${whereClause}`;
    db.all.apply(db, [sql, ...sqlParams]);
  }
}

module.exports.Entry = Entry;
