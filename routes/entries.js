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

exports.filterById = (req, res, next) => {
  Entry.filter({ userId: req.params.userId }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records by ID',
      entries,
    });
  });
};

exports.filterByDate = (req, res, next) => {
  Entry.filter({ date: req.params.date }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records by Date',
      entries,
    });
  });
};

exports.filter = (req, res, next) => {
  Entry.filter({ userId: req.params.userId, date: req.params.date }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records',
      entries,
    });
  });
};
