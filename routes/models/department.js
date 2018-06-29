const { db } = require('./db');

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
