const elemUserId = document.getElementById('userid');
const elemFingerId = document.getElementById('fingerid');
const elemResult = document.getElementById('results');
const elemDtStr = document.getElementById('fmtDtStr');

var taEntry_btn = document.getElementById('taEntry');

[...document.getElementsByTagName('button')].forEach(elem => {
  if(elem.id !== 'taEntry') elem.addEventListener('click', clearLastRes);
});

const goToTaPage = () => {
  const currDate = createTimeStr().slice(0, 10);
  post('http://localhost:3000/filter', {
    userId: elemUserId.value,
    listAll: 'true',
    dtStart: `${currDate} 00:00`,
    dtEnd: `${currDate} 23:59`,
  }, true);
  taEntry_btn.style.visibility = 'hidden';
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
  if (msg && event.origin === 'http://localhost:3000') {
    console.log(`message from CS: ${JSON.stringify(msg)}`);
    updateModelFooterBtn(msg);
    populateResMsg(msg);
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
    saveTaRecord(res.data.userId || res.data.clientUserId, timeStr);
  }
  elemDtStr.value = `現在時刻 ${createResTimeStr()}`;
}

function clearLastRes() {
  elemResult.value = '';
  elemDtStr.value = '';
  resetInputTextColor();
  const btn = this.id;
  if (btn === 'verify' || btn === 'identify') {
    elemFingerId.selectedIndex = 0;
    if (btn === 'identify') elemUserId.value = '';
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

function saveTaRecord(userId, dateTime) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/addEntry');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({userId, dateTime}));
}
