const sqlite3 = require('sqlite3').verbose();

const dbName = 'webTA.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  const sqls = [
    "CREATE TABLE IF NOT EXISTS `Privilege` (`PrivilegeId` INTEGER NOT NULL UNIQUE, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`PrivilegeId`))",
    "CREATE TABLE IF NOT EXISTS `Department` (`DepartmentId` INTEGER NOT NULL UNIQUE, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`DepartmentId`))",
    "CREATE TABLE IF NOT EXISTS `User` (`UserId` INTEGER NOT NULL UNIQUE, `UserName` TEXT NOT NULL UNIQUE, `NameString`	TEXT NOT NULL, `PrivilegeId` INTEGER NOT NULL, `DepartmentId` INTEGER,  PRIMARY KEY (`UserId`), FOREIGN KEY (`DepartmentId`) REFERENCES `Department` (`DepartmentId`), FOREIGN KEY (`PrivilegeId`) REFERENCES `Privilege` (`PrivilegeId`))",
    "CREATE TABLE IF NOT EXISTS `Location` (`LocationId` INTEGER NOT NULL UNIQUE, `IpAddress` TEXT NOT NULL UNIQUE, PRIMARY KEY (`LocationId`));",
    "CREATE TABLE IF NOT EXISTS `Event` (`EventId` INTEGER NOT NULL UNIQUE, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`EventId`));",
    "CREATE TABLE IF NOT EXISTS `Entry` (`EntryId` INTEGER NOT NULL UNIQUE, `UserId` INTEGER NOT NULL, `DateTime` DATETIME NOT NULL, `LocationId` INTEGER NOT NULL, `EventId` INTEGER NOT NULL, PRIMARY KEY (`EntryId`), FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`), FOREIGN KEY(`EventId`) REFERENCES `Event`(`EventId`), FOREIGN KEY (`LocationId`) REFERENCES `Location` (`LocationId`))",
    "INSERT OR IGNORE INTO Event (Name) VALUES ( 'Clock-In' )",
    "INSERT OR IGNORE INTO Event (Name) VALUES ( 'Clock-Out' )",
    "INSERT OR IGNORE INTO Privilege (Name) VALUES ( 'admin' )",
    "INSERT OR IGNORE INTO Privilege (Name) VALUES ( 'normal' )"
  ];
  sqls.forEach(sql => {
    db.run(sql);
  });
});

module.exports.db = db;
