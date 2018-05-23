const { db } = require('./db');

db.serialize(() => {
  const sql =  "CREATE TABLE IF NOT EXISTS `User` (`UserId` INTEGER NOT NULL, `UserName` TEXT NOT NULL UNIQUE, `DepartmentId` INTEGER, `PrivilegeId` INTEGER NOT NULL, PRIMARY KEY (`UserId`), FOREIGN KEY (`DepartmentId`) REFERENCES `Department` (`DepartmentId`), FOREIGN KEY (`PrivilegeId`) REFERENCES `Privilege` (`PrivilegeId`))";
  db.run(sql);
});

class User {
  static all(cb) {
    const sql = "SELECT UserName, Privilege.Name AS PrivilegeName, Department.Name AS DepartmentName FROM User JOIN Privilege ON User.PrivilegeId = Privilege.PrivilegeId LEFT JOIN Department ON User.DepartmentId = Department.DepartmentId";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO User (UserName, DepartmentId, PrivilegeId) VALUES (?, ?, ?)";
    db.run(sql, data.UserName, data.DepartmentId, data.PrivilegeId, cb);
  }
}

module.exports.User = User;
