const { db } = require('./db');

db.serialize(() => {
  const sql =  "CREATE TABLE IF NOT EXISTS `User` (`UserId` INTEGER NOT NULL UNIQUE, `UserName` TEXT NOT NULL UNIQUE, `NameString`	TEXT NOT NULL, `PrivilegeId` INTEGER NOT NULL, `DepartmentId` INTEGER,  PRIMARY KEY (`UserId`), FOREIGN KEY (`DepartmentId`) REFERENCES `Department` (`DepartmentId`), FOREIGN KEY (`PrivilegeId`) REFERENCES `Privilege` (`PrivilegeId`))";
  db.run(sql);
});

class User {
  static all(cb) {
    const sql = "SELECT UserName, Privilege.Name AS PrivilegeName, Department.Name AS DepartmentName FROM User JOIN Privilege ON User.PrivilegeId = Privilege.PrivilegeId LEFT JOIN Department ON User.DepartmentId = Department.DepartmentId";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO User (UserName, NameString, PrivilegeId, DepartmentId) VALUES (?, ?, ?, ?)";
    db.run(sql, data.UserName, data.NameString, data.PrivilegeId, data.DepartmentId, cb);
  }

  static allAdmin (data, cb) {
    const sql = "SELECT UserName AS AdminUser FROM User WHERE PrivilegeId = (SELECT PrivilegeId FROM Privilege WHERE Name = 'admin')";
    db.all(sql, cb);
  }
}

module.exports.User = User;
