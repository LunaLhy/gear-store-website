const API_LOGIN_URL = "http://localhost:5000/api/users/login";

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    }

});

async function handleLogin(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

  // check rỗng
    if (!email || !password) {
    alert("Please fill all fields");
    return;
    }

    try {

    const response = await fetch(API_LOGIN_URL, {
        method: "POST",

        headers: {
        "Content-Type": "application/json",
        },

        body: JSON.stringify({
        email,
        password,
        }),
    });

    const data = await response.json();

    // login success
    if (response.ok) {

      // lưu user
        localStorage.setItem("user", JSON.stringify(data.user));

      // lưu token nếu có
        if (data.token) {
        localStorage.setItem("token", data.token);
        }

        alert("Login successful!");

      // chuyển trang
        window.location.href = "index.html";

    } else {

        alert(data.message || "Login failed");

    }

    } catch (error) {

    console.error("Login error:", error);

    alert("Cannot connect to server");

    }

}