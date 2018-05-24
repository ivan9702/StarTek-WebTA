const { Entry } = require('../models/entry');
const pJson = require('../package.json');

exports.listAll = (req, res, next) => {
  Entry.all((err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'All the TA Records',
      listAll: 'true',
      entries,
      home: req.headers.origin,
      version: pJson.version
    });
  });
};

exports.addEntry = (req, res, next) => {
  const ipAddress = req.ip.match(/:([\d\.]*$)/)[1];
  const data = {...req.body, ipAddress};
  Entry.create(data, (err, entry) => {
    if (err) return next(err);
    res.status(201).send('A TA record is saved');
  });
};

exports.filter = (req, res, next) => {
  let { userId, listAll, dtStart, dtEnd } = req.body;

  const conditions = {
    userId,
    dtStart: (listAll === 'true') ? dtStart : (dtStart.slice(0, 10) + ' 00:00'),
    dtEnd: (listAll === 'true') ? dtEnd : (dtEnd.slice(0, 10) + ' 23:59'),
  };

  Entry.filter(conditions, (err, entries) => {
    if (err) return next(err);

    if (listAll === 'false') {
      const taStarts = [];
      const taEnds = [];
      if (entries.length > 0) {
        taStarts.push(entries[0]);
        for (let i = 1; i < entries.length; i++) {
          if (entries[i].dateTime.slice(0, 10) !== entries[i - 1].dateTime.slice(0, 10)) {
            taEnds.push(entries[i - 1]);
            taStarts.push(entries[i]);
          }
        }
        taEnds.push(entries[entries.length - 1]);
      }
      res.render('entries', {
        title: 'Filtered Records',
        userId,
        listAll,
        taStarts,
        taEnds,
        dateTime: {
          date: {
            start: conditions.dtStart.slice(0, 10),
            end: conditions.dtEnd.slice(0, 10),
          },
          time: {
            start: conditions.dtStart.slice(11, 16),
            end: conditions.dtEnd.slice(11, 16)
          }
        },
        home: req.headers.origin,
        version: pJson.version
      });
    } else {
      res.render('entries', {
        title: 'Filtered Records',
        userId,
        listAll,
        entries,
        dateTime: {
          date: {
            start: conditions.dtStart.slice(0, 10),
            end: conditions.dtEnd.slice(0, 10),
          },
          time: {
            start: conditions.dtStart.slice(11, 16),
            end: conditions.dtEnd.slice(11, 16)
          }
        },
        home: req.headers.origin,
        version: pJson.version
      });
    }
  });
};
