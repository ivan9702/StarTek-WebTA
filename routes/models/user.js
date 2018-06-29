const { db } = require('./db');

class User {
  static all(data, cb) {
    const sql = "SELECT UserName AS userId, NameString AS userName FROM User";
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
