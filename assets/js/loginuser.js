if (window.location.hash && window.location.hash == '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
        } else {
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
}

var loginCallBack = function(){
    location.reload();
}

var fblogin = function(){
    window.open("/auth/facebook", "FacebookLogin", "width=640, height=480");
}

var fblogout = function(){
  locnow = encodeURIComponent(window.location.href);
  window.location.href = "/api/logout?url="+locnow;
}

var openMyMemes = function(){
  window.location.href = "/mymemes";
}

var loginButton = document.getElementById("loginButton");
var logoutButton = document.getElementById("logoutButton");
var mymemeButton = document.getElementById("mymemeslink");

if(loginButton){
  loginButton.addEventListener("click", fblogin, false);
}

if(logoutButton){
  logoutButton.addEventListener("click",fblogout, false );
}

if(mymemeButton){
  mymemeButton.addEventListener("click",openMyMemes, false);
}

$("#loggedIn").hover(
  function () {
    $(this).addClass('loggedInFull');
  }, 
  function () {
    $(this).removeClass('loggedInFull');
  }
  );