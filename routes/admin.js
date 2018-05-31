const { User } = require('../models/user');
const pJson = require('../package.json');

const arrAdminUser = [];

User.allAdmin(null, (err, adminUser) => {
  if (err) return next(err);
  adminUser.forEach(user => {
    arrAdminUser.push(user.AdminUser);
  });
});

exports.home = (req, res, next) => {
  if (!arrAdminUser.includes(req.body.userId)) {
    const idxURL = `${req.protocol}://${req.hostname}:${req.client.localPort}`;
    res.send(`<div style="text-align: center">
                <h1>
                  ${req.body.userId} isn't an Admin user
                </h1>
                <h2> Go Back To Welcome Page in <span id='timer'></span> sec</h2>
              </div>
              <script>
                const elemTimer = document.getElementById('timer');
                elemTimer.style.color = 'red';
                elemTimer.innerHTML = 5;
                const id = setInterval(() => {
                  elemTimer.innerHTML -= 1;
                }, 1000);
                setTimeout(() => {
                  window.location.href = '${idxURL}'
                }, 5000);
              </script>`);
  } else {
    res.render('admin', {
      title: 'STARTEK WebTA Admin',
      home: req.headers.origin,
      version: pJson.version
    });
  }
};

exports.queryAdmin = (req, res, next) => {
  res.status(200).send(arrAdminUser);
};

exports.arrAdminUser = arrAdminUser;
