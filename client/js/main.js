const user = JSON.parse(localStorage.getItem("user"));

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const adminLink = document.getElementById("adminLink");

// USER LOGIN
if (user) {

  // hide login/register
  if (loginLink) {
    loginLink.style.display = "none";
  }

  if (registerLink) {
    registerLink.style.display = "none";
  }

  // show user info
  if (userBox) {
    userBox.style.display = "flex";
  }

  if (userName) {
    userName.innerText = user.name;
  }

  // ADMIN ROLE
  if (adminLink && user.role === "admin") {
    adminLink.style.display = "inline-block";
  }

} else {

  // hide admin if not login
  if (adminLink) {
    adminLink.style.display = "none";
  }

}

// LOGOUT
if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    window.location.href = "login.html";

  });

}