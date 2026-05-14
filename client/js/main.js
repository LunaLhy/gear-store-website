const user = JSON.parse(localStorage.getItem("user"));
const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

if(user){
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    userBox.style.display = "flex";
    userName.innerText = user.name;
}

// logout
if(logoutBtn){
    logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    });
}

// Admin
const user = JSON.parse(localStorage.getItem("user"));

const adminLink = document.getElementById("adminLink");

if (user && user.role === "admin") {
    adminLink.style.display = "inline-block";
} else {
    adminLink.style.display = "none";
}
// Gear Store
const user = JSON.parse(localStorage.getItem("user"));

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const adminLink = document.getElementById("adminLink");

if (user) {
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";

  if (userBox) userBox.style.display = "flex";
  if (userName) userName.innerText = user.name;

  if (adminLink && user.role === "admin") {
    adminLink.style.display = "inline-block";
  }
} else {
  if (adminLink) adminLink.style.display = "none";
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
