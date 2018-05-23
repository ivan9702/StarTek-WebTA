const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Privilege` (`PrivilegeId` INTEGER NOT NULL, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`PrivilegeId`))";
  db.run(sql);
});

class Privilege {
  static all(cb) {
    const sql = "SELECT PrivilegeId AS 'Privilege ID', Name AS 'Privilege' FROM Privilege";
    db.all(sql, cb);
  }
}

module.exports.Privilege = Privilege;
