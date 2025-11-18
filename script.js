// Juplite common JS helper
document.addEventListener("DOMContentLoaded", function () {
  var yearEls = document.querySelectorAll('#year');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
});
