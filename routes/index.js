var express = require('express');
var router = express.Router();

const pJson = require('../package.json');
const { arrAdminUser } = require('./admin.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (arrAdminUser.length === 0) return res.redirect('./admin');
  res.render('index', {
    title: 'STARTEK WebTA',
    version: pJson.version
  });
});

module.exports = router;
