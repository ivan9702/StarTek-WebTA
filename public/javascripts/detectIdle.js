var idleTime = 0;
var threshold = 120;
const enrollBtn = document.getElementById('enroll');

document.addEventListener('keyup', () => {
  console.log('document keyup event reset');
  idleTime = 0;
});
window.addEventListener('message', () => {
  threshold = 120;
  console.log('window message event reset');
  idleTime = 0;
});
document.addEventListener('click', function(event) {
  threshold = (event.target === enrollBtn) ? 300 : 120;
  console.log('document click event reset');
  idleTime = 0;
});

function timerIncrement() {
  setTimeout(timerIncrement, 1000);
  idleTime = idleTime + 1;
  console.log('idleTime: ', idleTime);
  console.log('threshold: ', threshold);
  if (idleTime > threshold) {
    window.location.href = originURL;
  }
}

setTimeout(timerIncrement, 1000);
