const user = JSON.parse(localStorage.getItem("user"));

const loginLink = document.getElementById("loginLink");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const adminBadge = document.getElementById("adminBadge");

const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const logoutBtn = document.getElementById("logoutBtn");

const adminOnlyLinks =
  document.querySelectorAll(".admin-only");

if (user) {

  if (loginLink)
    loginLink.style.display = "none";

  if (userBox)
    userBox.style.display = "block";

  if (userName)
    userName.innerText = `Hi, ${user.name}`;

  const isAdmin =
    user.role === "admin" ||
    user.isAdmin === true ||
    user.isAdmin === "true";

  // SHOW ADMIN BADGE
  if (adminBadge) {
    adminBadge.style.display =
      isAdmin ? "inline-block" : "none";
  }

  // AUTO WIDTH ACCOUNT BUTTON
  if (accountBtn) {

    if (isAdmin) {
      accountBtn.classList.add("admin-account");
    } else {
      accountBtn.classList.remove("admin-account");
    }
  }

  // SHOW/HIDE ADMIN LINKS
  adminOnlyLinks.forEach((link) => {
    link.style.display =
      isAdmin ? "block" : "none";
  });

} else {

  if (userBox)
    userBox.style.display = "none";

  adminOnlyLinks.forEach((link) => {
    link.style.display = "none";
  });
}

// DROPDOWN
if (accountBtn && accountDropdown) {

  accountBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    accountDropdown.classList.toggle("show");
  });

  document.addEventListener("click", () => {

    accountDropdown.classList.remove("show");
  });
}

// LOGOUT
if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "index.html";
  });
}