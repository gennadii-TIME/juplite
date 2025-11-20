// JupLite common JS
// Right now we only set the current year in the footer on pages that include #year.

document.addEventListener("DOMContentLoaded", function () {
  var yearEls = document.querySelectorAll('#year');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
});
