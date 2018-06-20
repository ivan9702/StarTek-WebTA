var idleTime = 0;
var threshold = 120;
const enrollBtn = document.getElementById('enroll');
const userNameInput = document.getElementById('userName');

document.addEventListener('keyup', function() {
  console.log('document keyup event reset');
  idleTime = 0;
});
window.addEventListener('message', function() {
  threshold = 120;
  console.log('window message event reset');
  idleTime = 0;
});
userNameInput.addEventListener('focus', function() {
  if (this.style.color === 'white') {
    this.value = '';
    this.setAttribute("style", "color: black; background-color: white;");
  }
});
document.addEventListener('click', function(event) {
  if (event.target === enrollBtn) {
    if (!userNameInput.value) {
      userNameInput.value = 'Required';
      userNameInput.setAttribute("style", "color: white; background-color: red;");
    } else {
      threshold = 300;
    }
  }
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
