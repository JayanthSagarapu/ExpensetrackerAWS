const signBtn = document.getElementById("sign");
const loginBtn = document.getElementById("login");
const errormsg = document.getElementById("error");

signBtn.onclick = async () => {
  window.location.href = "../Signup/signup.html";
};

loginBtn.onclick = async () => {
  window.location.href = "../Login/login.html";
};
