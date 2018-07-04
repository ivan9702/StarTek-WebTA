const { User } = require('../models');
const { arrAdminUser, allUserId, allUserName } = require('./admin.js');


exports.createUser = async (req, res, next) => {
  const data = req.body;
  let resMsg = `User ${data.UserName} is created`;

  try {
    const user = await User.create(data, {
      fields: ['UserName', 'NameString', 'PrivilegeId']
    });
  }
  catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      resMsg = `User ${data.UserName} already exists`;
      return res.status(200).send(resMsg);
    } else {
      return next(e);
    }
  }

  if (data.PrivilegeId === '1') {
    arrAdminUser.push(data.UserName);
    if (arrAdminUser.length === 1) resMsg = 'First admin is created';
  }

  allUserId.push(data.UserName);
  allUserName.push(data.NameString);
  res.status(201).send({
    resMsg,
    adminUser: arrAdminUser,
    allUserId,
    allUserName
  });
};
