const { db } = require('./db');

db.serialize(() => {
  const sql = "CREATE TABLE IF NOT EXISTS `Department` (`DepartmentId` INTEGER NOT NULL, `Name` TEXT NOT NULL UNIQUE, PRIMARY KEY (`DepartmentId`))";
  db.run(sql);
});

class Department {
  static all(cb) {
    const sql = "SELECT DepartmentId AS 'Department ID', Name AS 'Department Name' FROM Department";
    db.all(sql, cb);
  }

  static create(data, cb) {
    const sql = "INSERT INTO Department (Name) VALUES (?)";
    db.run(sql, data.Name, cb);
  }
}

module.exports.Department = Department;
