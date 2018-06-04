const { User } = require('../models/user');
const { arrAdminUser } = require('./admin.js');

exports.createUser = (req, res, next) => {
  const data = req.body;
  let resMsg = 'User is created';
  User.create(data, err => {
    if (err) {
      if (err.errno === 19) {
        return res.status(200).send('User already exists');
      } else {
        return next(err);
      }
    }
    if (data.PrivilegeId === '1') {
      arrAdminUser.push(data.UserName);
      if (arrAdminUser.length === 1) resMsg = 'First admin is created';
    }
    res.status(201).send(resMsg);
  });
};
