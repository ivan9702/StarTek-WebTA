$('#datepicker-start').datepicker({
  uiLibrary: 'bootstrap4',
  format: 'yyyy-mm-dd'
});

$('#datepicker-end').datepicker({
  uiLibrary: 'bootstrap4',
  format: 'yyyy-mm-dd'
});

$('#timepicker-start').timepicker({
  format: 'HH:MM'
});

$('#timepicker-end').timepicker({
  format: 'HH:MM'
});

const BtnQuery = document.getElementById('taRecordsQuery');
const userId = document.getElementById('queryUserId').innerHTML.match('Hello, (.*)')[1];
const dateStart = document.getElementById('datepicker-start');
const timeStart = document.getElementById('timepicker-start');
const dateEnd = document.getElementById('datepicker-end');
const timeEnd = document.getElementById('timepicker-end');
const listAllChk = document.getElementById('listAll');
const originURL = document.location.toString().replace(/\/[^\/]*$/, '');

listAllChk.checked = listAllChk.value === 'true';

BtnQuery.addEventListener('click', () => {
  post(originURL + '/filter', {
    userId,
    dtStart: `${dateStart.value} ${timeStart.value}`,
    dtEnd: `${dateEnd.value} ${timeEnd.value}`,
    listAll: listAllChk.checked,
  }, false);
});
