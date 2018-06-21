var idleTime = 0;
var threshold = 120;
const enrollBtn = document.getElementById('enroll');

document.addEventListener('keyup', function(event) {
  if (userNameInput) {
    const userIdIdx = allUserId.findIndex(function(el) {
      return el === elemUserId.value;
    });

    if (userIdIdx !== -1) {
      userNameInput.value = allUserName[userIdIdx];
      userNameInput.readOnly = true;
    } else {
      if (event.target === elemUserId) userNameInput.value = '';
      userNameInput.readOnly = false;
    }
  }
  idleTime = 0;
});
window.addEventListener('message', function() {
  threshold = 120;
  idleTime = 0;
});

if (userNameInput) {
  userNameInput.addEventListener('focus', function() {
    if (this.style.color === 'white') {
      this.value = '';
      this.setAttribute("style", "color: black; background-color: white;");
    }
  });
}

document.addEventListener('click', function(event) {
  if (event.target === enrollBtn) {
    if (!userNameInput.value) {
      userNameInput.value = 'Required';
      userNameInput.setAttribute("style", "color: white; background-color: red;");
    } else {
      threshold = 300;
    }
  }
  idleTime = 0;
});

function timerIncrement() {
  const logoutTimer = setTimeout(timerIncrement, 1000);
  idleTime = idleTime + 1;
  if (idleTime > threshold) {
    clearTimeout(logoutTimer);
    sendRegToWebAPI('cancel');
    window.location.href = originURL;
  }
}

setTimeout(timerIncrement, 1000);