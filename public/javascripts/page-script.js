const elemUserId = document.getElementById('userid');
const elemFingerId = document.getElementById('fingerid');
const elemResult = document.getElementById('results');
const modalResDiv = document.getElementById('modalResDiv');
const resModelLabel = document.getElementById('resModelLabel');

var taEntry_btn = document.getElementById('taEntry');

[...document.getElementsByTagName('button')].forEach(elem => {
  elem.addEventListener('click', clearLastRes);
});

const goToTaPage = () => {
  post('http://localhost:3000/filter', { userId: elemUserId.value });
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
  elemResult.value = res.message;
  const timeStr = createTimeStr();

  if ( res.data && res.data.fpIndex ) {
    elemFingerId.style.color = 'red';
    elemFingerId.selectedIndex = res.data.fpIndex;
  }

  if ( res.data && (res.data.userId || res.data.clientUserId)) {
    elemUserId.style.color = 'red';
    elemUserId.value = res.data.userId || res.data.clientUserId;
    saveTaRecord(res.data.userId || res.data.clientUserId, timeStr);
  }
  modalResDiv.style.color = 'red';
  modalResDiv.innerHTML = `<h5>${res.message}</h5>`;
  resModelLabel.innerHTML = `<h5>${timeStr}</h5>`;
  $('#resModel').modal('show');
}

function clearLastRes() {
  elemResult.value = '';
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

function saveTaRecord(userId, dateTime) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/addEntry');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({userId, dateTime}));
}

function post(path, params, method) {
  method = method || "post";

  const form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  form.setAttribute("target", "_blank");

  for(let key in params) {
    if(params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}
