const { db } = require('./db');

class Privilege {
  static all(cb) {
    const sql = "SELECT PrivilegeId AS 'Privilege ID', Name AS 'Privilege' FROM Privilege";
    db.all(sql, cb);
  }
}

module.exports.Privilege = Privilege;
