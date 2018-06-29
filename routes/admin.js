const { User } = require('../models/user');
const pJson = require('../package.json');

const arrAdminUser = [];
const allUserId = [];
const allUserName = [];

// User.allAdmin(null, (err, adminUser) => {
//   if (err) return next(err);
//   adminUser.forEach(user => {
//     arrAdminUser.push(user.AdminUser);
//   });
// });

// User.all(null, (err, users) => {
//   if (err) return next(err);
//   users.forEach(user => {
//     allUserId.push(user.userId);
//     allUserName.push(user.userName);
//   });
// });

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
