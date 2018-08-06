document.addEventListener('keyup', function(event) {
  idleTime = 0;
});

document.addEventListener('click', function(event) {
  idleTime = 0;
});

function timerIncrement() {
  const logoutTimer = setTimeout(timerIncrement, 1000);
  idleTime = idleTime + 1;
  if (idleTime > threshold) {
    clearTimeout(logoutTimer);
    window.location.href = originURL;
  }
}

setTimeout(timerIncrement, 1000);
