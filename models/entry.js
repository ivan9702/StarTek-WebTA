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
    const sql = 'SELECT * FROM entries WHERE id = (?)';
    db.all(sql, data.userId, cb);
  }
}

module.exports = db;
module.exports.Entry = Entry;
