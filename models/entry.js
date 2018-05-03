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
    const sqlExp = [];
    let sqlParams = [cb];

    if (data.userId) {
      sqlExp.unshift(` id = (?) `);
      sqlParams.unshift(data.userId);
    }
    if (data.dtStart) {
      sqlExp.unshift(` dateTime >= datetime(?) `);
      sqlParams.unshift(`${data.dtStart}`);
    }
    if (data.dtEnd) {
      sqlExp.unshift(` dateTime <= datetime(?) `);
      sqlParams.unshift(`${data.dtEnd}`);
    }

    const whereClause = sqlExp.join('AND');
    const sql = `SELECT * FROM entries WHERE${whereClause}`;
    db.all.apply(db, [sql, ...sqlParams]);
  }
}

module.exports = db;
module.exports.Entry = Entry;
