const { db } = require('./db');

class Entry {
  static all(cb) {
    const sql = ` SELECT Location.IpAddress AS location,
                        User.UserName AS id,
                        User.NameString AS nameStr,
                        Entry.DateTime AS dateTime,
                        Event.Name AS event
                  FROM Entry
                  JOIN Location ON Location.LocationId = Entry.LocationId
                  JOIN Event ON Event.EventId = Entry.EventId
                  JOIN User ON User.UserId = Entry.UserId`;
    db.all(sql, cb);
  }

  static create(data, cb) {
    db.serialize(() => {
      db.run("INSERT OR IGNORE INTO Location (IpAddress) VALUES ( ? )", data.ipAddress);
      db.run("INSERT INTO Entry (UserId, DateTime, LocationId, EventId) VALUES ( (SELECT UserId FROM User WHERE UserName = ?), ?, (SELECT LocationId FROM Location WHERE IpAddress = ?), (SELECT EventId FROM Event WHERE Name = ?))", data.userId, data.dateTime, data.ipAddress, data.event, cb);
    });
  }

  static filter(data, cb) {
    const sqlExp = [];
    let sqlParams = [cb];

    if (data.userId) {
      sqlExp.unshift(` User.UserId = (SELECT UserId FROM User WHERE UserName = (?)) `);
      sqlParams.unshift(data.userId);
    }
    if (data.dtStart) {
      sqlExp.unshift(` DateTime >= datetime(?) `);
      sqlParams.unshift(`${data.dtStart}`);
    }
    if (data.dtEnd) {
      sqlExp.unshift(` DateTime <= datetime(?) `);
      sqlParams.unshift(`${data.dtEnd}`);
    }

    const whereClause = sqlExp.join('AND');
    const sql = ` SELECT DateTime AS dateTime,
                        Location.IpAddress AS location,
                        Event.Name AS event,
                        User.NameString AS nameStr,
                        User.UserName AS id
                  FROM Entry
                  JOIN Location ON Location.LocationId = Entry.LocationId
                  JOIN Event ON Event.EventId = Entry.EventId
                  JOIN User ON User.UserId = Entry.UserId
                  WHERE${whereClause}`;
    db.all.apply(db, [sql, ...sqlParams]);
  }
}

module.exports.Entry = Entry;
