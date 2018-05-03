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
const userId = document.getElementById('queryUserId').innerHTML;
const dateStart = document.getElementById('datepicker-start');
const timeStart = document.getElementById('timepicker-start');
const dateEnd = document.getElementById('datepicker-end');
const timeEnd = document.getElementById('timepicker-end');

BtnQuery.addEventListener('click', () => {
  post('http://localhost:3000/filter', {
    userId,
    dtStart: `${dateStart.value} ${timeStart.value}`,
    dtEnd: `${dateEnd.value} ${timeEnd.value}`,
  });
});
