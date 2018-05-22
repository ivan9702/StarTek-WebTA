const pJson = require('../package.json');

exports.home = (req, res, next) => {
  res.render('admin', {
    title: 'STARTEK WebTA Admin',
    version: pJson.version
  });
};



