var idleTime = 0;

document.addEventListener('keyup', () => {
  console.log('document keyup event reset');
  idleTime = 0;
});
window.addEventListener('message', () => {
  console.log('window message event reset');
  idleTime = 0;
});
document.addEventListener('click', () => {
  console.log('document click event reset');
  idleTime = 0;
});

function timerIncrement() {
  setTimeout(timerIncrement, 1000);
  idleTime = idleTime + 1;
  console.log('idleTime: ', idleTime);
  if (idleTime > 120) {
    window.location.href = originURL;
  }
}

setTimeout(timerIncrement, 1000);
