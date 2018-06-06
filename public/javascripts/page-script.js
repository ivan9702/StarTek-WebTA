const elemUserId = document.getElementById('userid');
const elemNameStr = document.getElementById('userName');
const elemFingerId = document.getElementById('fingerid');
const elemPrivilegeId = document.getElementById('privilegeId');
const elemResult = document.getElementById('results');
const elemDtStr = document.getElementById('fmtDtStr');
const originURL = document.location.toString().replace(/\/[^\/]*$/, '');
const allBtns = document.querySelectorAll('button');
const webApiUrl = 'http://localhost:5887/api/';
let redirectTo = '';
let clkEvent = '';
let adminUsers = [];

(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', originURL + '/queryAdmin');
    xhr.send();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        adminUsers = xhr.response.slice(1, -1).replace(/\"/g, '').split(',');
      }
    }
})();

const selectFPService = btnId => {
  switch (btnId) {
    case 'clkIn':
      redirectTo = '';
      clkEvent = 'Clock-In';
      break;
    case 'clkOut':
      redirectTo = '';
      clkEvent = 'Clock-Out';
      break;
    case 'query':
      redirectTo = '/filter';
      break;
    case 'adminEntry':
      if (elemUserId.value && adminUsers.length > 0 && !adminUsers.includes(elemUserId.value)) {
        populateResMsg({
          message: `${elemUserId.value} is not an Admin`
        });
        return null;
      }
      redirectTo = '/admin';
      break;
    default:
      return btnId;
  }
  return elemUserId.value ? 'verify' : 'identify';
};

allBtns.forEach(elem => {
  elem.addEventListener('click', sendRegToWebAPI);
});

function getReqData (fpService) {
  switch (fpService) {
    case 'enroll':
    case 'delete_finger':
      return {
        userid: elemUserId.value,
        fingerid: elemFingerId.value
      };
      break;
    case 'verify':
      return {
        userid: elemUserId.value
      };
      break;
    default:
      return {};
  }
}

function sendRegToWebAPI () {
  const xhr = new XMLHttpRequest();
  const webApiRoute =  selectFPService(this.id);
  if (!webApiRoute) return null;
  const reqData = getReqData(webApiRoute);
  xhr.open('POST', webApiUrl + webApiRoute);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(reqData));
  xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log(xhr.response);
      populateResMsg(JSON.parse(xhr.response));
    }
  }
};

var taEntry_btn = document.getElementById('query');

const btns = document.getElementsByTagName('button');
const btnsArr = Array.prototype.slice.call(btns, 0);
btnsArr.forEach( function (elem) {
  if(elem.id !== 'taEntry') elem.addEventListener('click', clearLastRes);
});

(() => {
  elemUserId.value = '';
  elemResult.value = '';
  elemDtStr.value = '';
})();

const goToTaPage = () => {
  const currDate = createTimeStr().slice(0, 10);
  post(originURL + '/filter', {
    userId: elemUserId.value,
    querierId: elemUserId.value,
    listAll: 'true',
    dtStart: `${currDate} 00:00`,
    dtEnd: `${currDate} 23:59`,
  });
};

const goToAdminPage = () => {
  post(originURL + '/admin', {
    userId: elemUserId.value
  });
};

const goToPage = (page) => {
  switch (page) {
    case '/admin':
      goToAdminPage();
      break;
    case '/filter':
      goToTaPage();
      break;
    default:
      console.log('Stay Here');
  }
};

const updateModelFooterBtn = (res) => {
  taEntry_btn.style.visibility = 'hidden';
  if ( res.code === 20003 ) {
    taEntry_btn.addEventListener('click', goToTaPage.bind(taEntry_btn));
    taEntry_btn.style.visibility = 'visible';
  }
};

window.addEventListener('message', function(event) {
  const msg = event.data.response;
  const passCode = [ 20003, 20004 ];
  if (msg && event.origin === originURL) {
    console.log(`message from CS: ${JSON.stringify(msg)}`);
    populateResMsg(msg);
    if (passCode.includes(msg.code)) goToPage(msg.goToPage);
  }
});

elemFingerId.onfocus = elemUserId.onfocus = resetInputTextColor;

function populateResMsg(res) {
  elemResult.style.color = 'red';
  const timeStr = createTimeStr();
  elemResult.value = `${res.message}`;

  if ( res.data && res.data.fpIndex ) {
    elemFingerId.style.color = 'red';
    elemFingerId.selectedIndex = res.data.fpIndex;
  }

  if ( res.data && (res.data.userId || res.data.clientUserId)) {
    elemUserId.style.color = 'red';
    elemUserId.value = res.data.userId || res.data.clientUserId;
  }
  if (res.goToPage === '') {
    saveTaRecord(elemUserId.value, timeStr, res.clkEvent);
    resCodeHandler(res.code);
  }
}

function clearLastRes() {
  if (this.id !== 'adminEntry'){
    elemResult.value = '';
    resetInputTextColor();
    const btn = this.id;
    if (btn === 'verify' || btn === 'identify') {
      elemFingerId.selectedIndex = 0;
    }
  }
}

function resetInputTextColor() {
  elemFingerId.style.color = elemUserId.style.color = '';
}

function createTimeStr() {
  const currentdate = new Date();
  const dateTime = [currentdate.getMonth() + 1, currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()];
  const dateTimeArr = dateTime.map((num) => {
    let str = num.toString();
    return str = str.length === 2 ? str : '0'.concat(str);
  });
  return currentdate.getFullYear() + '-' + dateTimeArr[0] + '-' + dateTimeArr[1] + ' ' + dateTimeArr[2] + ':' + dateTimeArr[3] + ':' + dateTimeArr[4];
}

function createResTimeStr() {
  const dayNamesTw = [
    '日', '一', '二', '三', '四', '五', '六',
  ];
  const dateTime = new Date();

  return `${dateTime.getFullYear()}年${dateTime.getMonth() + 1}月${dateTime.getDate()}日 (${dayNamesTw[dateTime.getDay()]}) ${dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

function saveTaRecord(userId, dateTime, event) {
  if (event && userId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', originURL + '/addEntry');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({userId, dateTime, event}));
  }
}

const createUser = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', originURL + '/createUser');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    UserName: elemUserId.value,
    NameString: elemNameStr.value,
    DepartmentId: null,
    PrivilegeId: elemPrivilegeId.value
  }));
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.response === 'First admin is created') {
      setTimeout(() => {
        post(originURL + '/admin', {
          userId: elemUserId.value
        });
      }, 2000);
    }
  }
}

const resCodeHandler = (code) => {
  switch (code) {
    case 20001:
      createUser();
      break;
    default:
      console.log(`Code: ${code} is not yet handled !!`);
  }
};

function startTime () {
  elemDtStr.value = `${createTimeStr().slice(0, -3)}`;
  setTimeout(startTime, 500);
}

startTime();
