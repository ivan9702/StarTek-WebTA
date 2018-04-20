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
