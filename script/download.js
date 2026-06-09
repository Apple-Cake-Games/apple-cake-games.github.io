const headline = document.querySelector('.headline');
const btnLi = document.getElementById('btnLinux');
const btnWi = document.getElementById('btnWin');
const btnAd = document.getElementById('btnAndroid');

headline.addEventListener('click', function () {
  window.open('../index.html', '_self');
});

[btnLi, btnAd, btnWi, btnBrowser].forEach(function (btn) {
  if (btn) {
    btn.addEventListener('click', function () {
      document.getElementById('placeholder').innerHTML =
        'Download is currently not avaiable. Please try again later.';
    });
  }
});
