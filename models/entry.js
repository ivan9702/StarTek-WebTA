const sqlite3 = require('sqlite3').verbose();

const dbName = 'ta.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  const sql = 'CREATE TABLE IF NOT EXISTS entries (No integer primary key, id TEXT, dateTime TEXT)';
  db.run(sql);
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
    let sql = '';
    const sqlExp = [];
    let whereClause = '';

    if (data.userId) {
      sqlExp.push(` id = (?) `);
      sql = 'SELECT * FROM entries WHERE id = (?)';
      db.all(sql, data.userId, cb);
    }
    if (data.date) {
      sqlExp.push(` dateTime LIKE (?) `);
      sql = 'SELECT * FROM entries WHERE dateTime LIKE (?)';
      db.all(sql, `${data.date}%` , cb);
    }
    whereClause = sqlExp.join('AND');
    const newSql = `SELECT * FROM entries WHERE${whereClause}`;
    console.log('whereClause: ', whereClause);
    console.log('newSql: ', newSql);
  }
}

module.exports = db;
module.exports.Entry = Entry;
