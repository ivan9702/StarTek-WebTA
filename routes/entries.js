const Entry = require('../models/entry').Entry;
const pJson = require('../package.json');

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
      currDate: createDateStr(),
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
  Entry.filter({
    userId: req.body.userId,
    dtStart: req.body.dtStart,
    dtEnd: req.body.dtEnd
  }, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Filtered Records',
      entries,
      currDate: createDateStr(),
      version: pJson.version
    });
  });
};
