const { Entry, Location, Event, User } = require('../models');
const { arrAdminUser } = require('./admin.js');
const pJson = require('../package.json');

exports.listAll = async (req, res, next) => {
  try {
    const entriesModel = await Entry.findAll({
      attributes: [
        ['DateTime', 'dateTime']
      ],
      include: [{
        model: Location,
        required: true
      }, {
        model: Event,
        required: true
      }, {
        model: User,
        required: true,
        attributes: {
          exclude: ['DepartmentId', 'PrivilegeId']
        }
      }]
    });

    const entries = entriesModel.map(entry => {
      return {
        dateTime: entry.get('dateTime'),
        event: entry.Event.Name,
        id: entry.User.UserName,
        location: entry.Location.IpAddress,
        nameStr: entry.User.NameString
      };
    });

    res.render('entries', {
      title: 'All the TA Records',
      listAll: 'true',
      entries,
      home: req.headers.origin,
      version: pJson.version
    });
  } catch (e) {
    return next(e);
  }
};

exports.addEntry = (req, res, next) => {
  const ipAddress = req.ip.match(/:([\d\.]*$)/)[1];
  const data = {...req.body, ipAddress};
  Entry.create(data, (err, entry) => {
    if (err) return next(err);
    res.status(201).send('A TA record is saved');
  });
};

exports.filter = (req, res, next) => {
  let { userId, listAll, dtStart, dtEnd, querierId } = req.body;

  const conditions = {
    userId,
    dtStart: (listAll === 'true') ? dtStart : (dtStart.slice(0, 10) + ' 00:00'),
    dtEnd: (listAll === 'true') ? dtEnd : (dtEnd.slice(0, 10) + ' 23:59'),
  };

  Entry.filter(conditions, (err, entries) => {
    if (err) return next(err);

    const renderInfo = {
      title: 'Filtered Records',
      userId,
      querierId,
      listAll,
      dateTime: {
        date: {
          start: conditions.dtStart.slice(0, 10),
          end: conditions.dtEnd.slice(0, 10),
        },
        time: {
          start: conditions.dtStart.slice(11, 16),
          end: conditions.dtEnd.slice(11, 16)
        }
      },
      isAdmin: arrAdminUser.includes(querierId),
      home: req.protocol + '://' + req.headers.host,
      version: pJson.version
    };

    if (listAll === 'false') {
      const taStarts = [];
      const taEnds = [];
      if (entries.length > 0) {
        taStarts.push(entries[0]);
        for (let i = 1; i < entries.length; i++) {
          if (entries[i].dateTime.slice(0, 10) !== entries[i - 1].dateTime.slice(0, 10)) {
            taEnds.push(entries[i - 1]);
            taStarts.push(entries[i]);
          }
        }
        taEnds.push(entries[entries.length - 1]);
      }
      res.render('entries', {
        ...renderInfo,
        taStarts,
        taEnds
      });
    } else {
      res.render('entries', {
        ...renderInfo,
        entries
      });
    }
  });
};
