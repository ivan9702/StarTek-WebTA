const Entry = require('../models/entry').Entry;
const pJson = require('../package.json');

exports.listAll = (req, res, next) => {
  Entry.all((err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'All the TA Records',
      entries,
      version: pJson.version
    });
  });
};

exports.addEntry = (req, res, next) => {
  const data = req.body;
  Entry.create(data, (err, entry) => {
    if (err) return next(err);
    res.send('OK');
  });
};

exports.filter = (req, res, next) => {
  const { userId } = req.body;
  const conditions = {
    userId,
    dtStart: req.body.dtStart,
    dtEnd: req.body.dtEnd,
  };

  Entry.filter(conditions, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records',
      userId,
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
      version: pJson.version
    });
  });
};
