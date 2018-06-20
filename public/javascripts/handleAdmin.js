let adminUsers = [];
const userIdInput = document.getElementById('userid');
const btnDelete = document.getElementById('delete_finger');

function queryAdmin() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', originURL + '/queryAdmin');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      adminUsers = xhr.response.slice(1, -1).replace(/\"/g, '').split(',');
      console.log(adminUsers);
      checkAdminLock(adminUsers);
    }
  }
}

queryAdmin();

function keyEvtListener() {
  btnDelete.disabled = (adminUsers.includes(userIdInput.value)) ? true : false;
};

function checkAdminLock(adminUsers) {
  if (adminUsers.length === 1) {
    userIdInput.addEventListener('keyup', keyEvtListener);
  } else {
    userIdInput.removeEventListener('keyup', keyEvtListener);
  }
}

