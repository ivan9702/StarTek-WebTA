const Entry = require('../models/entry').Entry;

exports.listAll = (req, res, next) => {
  Entry.all((err, entries) => {
    if (err) return next(err);
    res.send(entries);
  });
};

exports.addEntry = (req, res, next) => {
  const data = req.body;
  Entry.create(data, (err, entry) => {
    if (err) return next(err);
    res.send('OK');
  });
};
