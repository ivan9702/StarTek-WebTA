const Entry = require('../models/entry').Entry;

exports.listAll = (req, res, next) => {
  Entry.all((err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'All the TA Records',
      entries,
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
  Entry.filter({ userId: req.query.userId, date: req.query.date }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records',
      entries,
    });
  });
};
