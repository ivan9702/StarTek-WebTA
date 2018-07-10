const { Op } = require('sequelize');

const { Entry, Location, Event, User } = require('../models');
const { arrAdminUser } = require('./admin.js');
const pJson = require('../package.json');

const locationMap = new Map();
const eventMap = new Map();
const userMap = new Map();

const syncUserMap = async () => {
  try {
    const users = await User.findAll({
      fields: ['UserId', 'UserName', 'NameString']
    });
    users.map(user => {
      userMap.set(user.get('UserName'), user.get('UserId'));
    });
    console.log(userMap);
  } catch (e) {
    console.log(e);
  }
};

syncUserMap();

(async () => {
  try {
    const locations = await Location.findAll();
    locations.map(location => {
      locationMap.set(location.get('IpAddress'), location.get('LocationId'));
    });
    console.log(locationMap);
  } catch (e) {
    console.log(e);
  }
})();

(async () => {
  try {
    const events = await Event.findAll();
    events.map(event => {
      eventMap.set(event.get('Name'), event.get('EventId'));
    });
    console.log(eventMap);
  } catch (e) {
    console.log(e);
  }
})();

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
        dateTime: formatTimeStr(entry.get('dateTime')),
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

exports.addEntry = async (req, res, next) => {
  const ipAddress = req.ip.match(/:([\d\.]*$)/)[1];
  const data = {...req.body, ipAddress};

  if ( !locationMap.get(data.ipAddress) ) {
    await Location.create({
      IpAddress: data.ipAddress
    }, {
      fields: ['IpAddress']
    })
    const createdLocation = await Location.findOne({
      where: {
        IpAddress: data.ipAddress
      }
    })
    locationMap.set(data.ipAddress, createdLocation.get('LocationId'));
    console.log(locationMap);
  }

  const entryToBeWritten = {
    DateTime: data.dateTime,
    EventId: eventMap.get(data.event),
    LocationId: locationMap.get(data.ipAddress),
    UserId: userMap.get(data.userId)
  };

  console.log(entryToBeWritten);

  try {
    await Entry.create(entryToBeWritten, {
      fields: ['DateTime', 'EventId', 'LocationId', 'UserId']
    })
    res.status(201).send('A TA record is saved');
  } catch (e) {
    return next(e);
  }
};

exports.filter = async (req, res, next) => {
  let { userId, listAll, dtStart, dtEnd, querierId } = req.body;

  const conditions = {
    userId,
    dtStart: (listAll === 'true') ? dtStart : (dtStart.slice(0, 10) + ' 00:00'),
    dtEnd: (listAll === 'true') ? dtEnd : (dtEnd.slice(0, 10) + ' 23:59'),
  };

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
    }],
    where: {
      UserId: userMap.get(userId),
      DateTime: {
        [Op.between]: [dtStart, dtEnd]
      }
    }
  });

  const entries = entriesModel.map(entry => {
    return {
      dateTime: formatTimeStr(entry.get('dateTime')),
      event: entry.get('Event').get('Name'),
      id: entry.get('User').get('UserName'),
      location: entry.get('Location').get('IpAddress'),
      nameStr: entry.get('User').get('NameString')
    };
  });

  console.log('entries: ', entries);

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
};

function formatTimeStr(dbDateTime) {
  let localDateTime;
  if (dbDateTime.length > 19) {
    localDateTime = new Date(dbDateTime + "UTC");
  } else {
    localDateTime = new Date(dbDateTime);
  }
  const dateTime = [localDateTime.getMonth() + 1, localDateTime.getDate(), localDateTime.getHours(), localDateTime.getMinutes(), localDateTime.getSeconds()];

  const dateTimeArr = dateTime.map(function(num) {
    let str = num.toString();
    return str = str.length === 2 ? str : '0'.concat(str);
  });
  return localDateTime.getFullYear() + '-' + dateTimeArr[0] + '-' + dateTimeArr[1] + ' ' + dateTimeArr[2] + ':' + dateTimeArr[3] + ':' + dateTimeArr[4];
}

exports.syncUserMap = syncUserMap;
