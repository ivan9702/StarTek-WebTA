const Entry = require('../models/entry').Entry;

function createDateStr() {
  const currentdate = new Date();
  const date = [currentdate.getMonth() + 1, currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()];
  const dateArr = date.map((num) => {
    let str = num.toString();
    return str = str.length === 2 ? str : '0'.concat(str);
  });
  return currentdate.getFullYear() + '-' + dateArr[0] + '-' + dateArr[1];
}

exports.listAll = (req, res, next) => {
  Entry.all((err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'All the TA Records',
      entries,
      currDate: createDateStr()
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
  Entry.filter({ userId: req.body.userId, date: req.body.date }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records',
      entries,
      currDate: createDateStr()
    });
  });
};
