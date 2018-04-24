const elemUserId = document.getElementById('userid');
const elemFingerId = document.getElementById('fingerid');
const elemResult = document.getElementById('results');
const modalResDiv = document.getElementById('modalResDiv');
const resModelLabel = document.getElementById('resModelLabel');

var taEntry_btn = document.getElementById('taEntry');
var enroll_btn = document.getElementById('enroll');
enroll_btn.addEventListener('click', enrollmessageContentScript);

function enrollmessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
	var send_finger_value = elemFingerId.value;
  clearLastRes(enroll_btn);
  window.postMessage({
    direction: 'lv0-TX',
    message: 'enroll&'+send_user_value+'&'+send_finger_value
  }, '*');
  console.log('Lv0 PS.js tx:'+'enroll&'+send_user_value+'&'+send_finger_value);
}
/*
enroll_btn.onclick = function() {
    alert('enroll click!');
}
*/
var verify_btn = document.getElementById('verify');
verify_btn.addEventListener('click', verifymessageContentScript);
function verifymessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
  clearLastRes(verify_btn);
  window.postMessage({
    direction: 'lv0-TX',
    message: 'verify&'+send_user_value
  }, '*');
  console.log('Lv0 PS.js tx:'+ 'verify&'+send_user_value);
}
/*
verify_btn.onclick = function() {
    alert('verify click!');
}
*/
var identify_btn = document.getElementById('identify');
identify_btn.addEventListener('click', identifymessageContentScript);
function identifymessageContentScript() {
  clearLastRes(identify_btn);
  window.postMessage({
    direction: 'lv0-TX',
    message: 'identify'
  }, '*');
  console.log('Lv0 PS.js tx:'+'identify');
}
/*
identify_btn.onclick = function() {
    alert('identify click!');
}
*/
var delete_finger_btn = document.getElementById('delete_finger');
delete_finger_btn.addEventListener('click', deletefingermessageContentScript);

function deletefingermessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
	var send_finger_value = elemFingerId.value;
  clearLastRes(delete_finger_btn);
  window.postMessage({
    direction: 'lv0-TX',
    message: 'delete_finger&'+send_user_value+'&'+send_finger_value
  }, '*');
  console.log('Lv0 PS.js tx:'+ 'delete_finger&'+send_user_value+'&'+send_finger_value);
}

/*
enroll_btn.onclick = function() {
    alert('enroll click!');
}
*/
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
  if (event.source == window &&
      event.data.direction &&
      event.data.direction == 'lv0-RX') {
        const response = JSON.parse(decodeURIComponent(event.data.message).replace(/\+/g, ' '));
        console.log(`Lv0 PS.js rx: ${JSON.stringify(response)}`);
        updateModelFooterBtn(response);
        populateResMsg(response);
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

function clearLastRes(btn) {
  elemResult.value = '';
  resetInputTextColor();
  if (btn === verify_btn || btn === identify_btn) {
    elemFingerId.selectedIndex = 0;
    if (btn === identify_btn) elemUserId.value = '';
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
