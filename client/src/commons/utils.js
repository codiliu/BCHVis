//define utils functions
export default {

  zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  },

  formateDate(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + "-" +
      zeroPad((date.getMonth() + 1), 2) + "-" +
      zeroPad(date.getDate(), 2);
  },

  formateTime(timestamp) {
    var date = new Date(timestamp);
    return zeroPad(date.getHours(), 2) + ":" +
      zeroPad(date.getMinutes(), 2) + ":" +
      zeroPad(date.getSeconds(), 2);
  }
  ,
  formateDatetime(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + "-" +
      zeroPad((date.getMonth() + 1), 2) + "-" +
      zeroPad(date.getDate(), 2) + " " +
      +zeroPad(date.getHours(), 2) + ":" +
      zeroPad(date.getMinutes(), 2) + ":" +
      zeroPad(date.getSeconds(), 2)
  },

  formateHour(timestamp) {
    var date = new Date(timestamp);
    return zeroPad(date.getHours(), 2) + ":" +
      zeroPad(date.getMinutes(), 2);
  }
}
