const fingerStr = [
  'N/A',
  'Right Thumb',
  'Right Index',
  'Right Middle',
  'Right Ring',
  'Right Little',
  'Left Thumb',
  'Left Index',
  'Left Middle',
  'Left Ring',
  'Left Little',
];

const elemUserId = document.getElementById("userid");
const elemFingerId = document.getElementById("fingerid");
const elemResult = document.getElementById("results");

var enroll_btn = document.getElementById('enroll');
enroll_btn.addEventListener("click", enrollmessageContentScript);

function enrollmessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
	var send_finger_value = elemFingerId.value;
  clearLastRes(enroll_btn);
  window.postMessage({
    direction: "lv0-TX",
    message: "enroll&"+send_user_value+"&"+send_finger_value
  }, "*");
  console.log("Lv0 PS.js tx:"+"enroll&"+send_user_value+"&"+send_finger_value);
}
/*
enroll_btn.onclick = function() {
    alert('enroll click!');
}
*/
var verify_btn = document.getElementById('verify');
verify_btn.addEventListener("click", verifymessageContentScript);
function verifymessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
  clearLastRes(verify_btn);
  window.postMessage({
    direction: "lv0-TX",
    message: "verify&"+send_user_value
  }, "*");
  console.log("Lv0 PS.js tx:"+ "verify&"+send_user_value);
}
/*
verify_btn.onclick = function() {
    alert('verify click!');
}
*/
var identify_btn = document.getElementById('identify');
identify_btn.addEventListener("click", identifymessageContentScript);
function identifymessageContentScript() {
  clearLastRes(identify_btn);
  window.postMessage({
    direction: "lv0-TX",
    message: "identify"
  }, "*");
  console.log("Lv0 PS.js tx:"+"identify");
}
/*
identify_btn.onclick = function() {
    alert('identify click!');
}
*/
var delete_finger_btn = document.getElementById('delete_finger');
delete_finger_btn.addEventListener("click", deletefingermessageContentScript);

function deletefingermessageContentScript() {
	var send_user_value = document.getElementById('userid').value;
	var send_finger_value = elemFingerId.value;
  clearLastRes(delete_finger_btn);
  window.postMessage({
    direction: "lv0-TX",
    message: "delete_finger&"+send_user_value+"&"+send_finger_value
  }, "*");
  console.log("Lv0 PS.js tx:"+ "delete_finger&"+send_user_value+"&"+send_finger_value);
}
/*
enroll_btn.onclick = function() {
    alert('enroll click!');
}
*/
window.addEventListener("message", function(event) {
  if (event.source == window &&
      event.data.direction &&
      event.data.direction == "lv0-RX") {
      	
      populateResMsg(JSON.parse(decodeURIComponent(event.data.message).replace(/\+/g, " ")));
      console.log("Lv0 PS.js rx:"+ event.data.message);

  }
});

elemFingerId.onfocus = elemUserId.onfocus = resetInputTextColor;

function populateResMsg(res) {
  elemResult.style.color = 'red';
  elemResult.value = res.message;

  if ( res.data && res.data.fpIndex ) {
    elemFingerId.style.color = 'red';
    elemFingerId.selectedIndex = res.data.fpIndex;
  }

  if ( res.data && res.data.userId ) {
    elemUserId.style.color = 'red';
    elemUserId.value = res.data.userId;
  }
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
