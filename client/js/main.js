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