var express = require('express');
var router = express.Router();

const pJson = require('../package.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'STARTEK WebTA',
    version: pJson.version
  });
});

module.exports = router;
