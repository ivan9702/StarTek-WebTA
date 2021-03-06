const { User, Privilege } = require('../models');
const pJson = require('../package.json');

const arrAdminUser = [];
const allUserId = [];
const allUserName = [];

(async () => {
  const users = await User.findAll({
    attributes: ['UserName', 'NameString']
  });

  users.forEach(user => {
    allUserId.push(user.UserName);
    allUserName.push(user.NameString);
  });
})();

(async () => {
  const adminPrivilege = await Privilege.findOne({
    where: {
      Name: 'admin'
    }
  });

  const adminUsers = await adminPrivilege.getUsers();
  adminUsers.forEach(user => {
    arrAdminUser.push(user.UserName);
  });
  console.log('arrAdminUser: ', arrAdminUser);
})();

exports.home = (req, res, next) => {
  if (!arrAdminUser.includes(req.body.userId) && req.method !== 'GET') {
    const rejScript = `
      <div style="text-align: center">
        <h1>
          ${req.body.userId} isn't an Admin user
        </h1>
        <h2> Go Back To Welcome Page in <span id='timer'></span> sec</h2>
      </div>
      <script>
        const elemTimer = document.getElementById('timer');
        elemTimer.style.color = 'red';
        elemTimer.innerHTML = 5;
        const id = setInterval(function() {
          elemTimer.innerHTML -= 1;
        }, 1000);
        setTimeout(function() {
          window.location.href = location.protocol + '//' + location.hostname + ':' + location.port
        }, 5000);
      </script>
    `;
    res.send(rejScript);
  } else {
    res.render('admin', {
      title: 'STARTEK WebTA Admin',
      home: req.protocol + '://' + req.headers.host,
      version: pJson.version,
      enrollAdminOnly: arrAdminUser.length === 0
    });
  }
};

exports.queryAdmin = (req, res, next) => {
  res.status(200).send(arrAdminUser);
};

exports.queryAllUser = (req, res, next) => {
  res.status(200).send({allUserId, allUserName});
};

exports.arrAdminUser = arrAdminUser;
exports.allUserId = allUserId;
exports.allUserName = allUserName;
