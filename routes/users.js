const { User } = require('../models/user');

exports.createUser = (req, res, next) => {
  const data = req.body;
  User.create(data, err => {
    if (err) {
      if (err.errno === 19) {
        return res.status(200).send('User already exists');
      } else {
        return next(err);
      }
    }
    res.status(201).send('User is created');
  });
};
