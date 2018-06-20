let adminUsers, allUserId, allUserName = [];
const userIdInput = document.getElementById('userid');
const btnDelete = document.getElementById('delete_finger');

function queryAdmin() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', originURL + '/queryAdmin');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      adminUsers = xhr.response.slice(1, -1).replace(/\"/g, '').split(',');
      checkAdminLock(adminUsers);
    }
  }
}

queryAdmin();

function queryAllUser() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', originURL + '/queryAllUser');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      const res = JSON.parse(xhr.response);
      allUserId = res.allUserId;
      allUserName = res.allUserName;
    }
  }
}

queryAllUser();

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

