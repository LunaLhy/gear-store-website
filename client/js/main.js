document.addEventListener('DOMContentLoaded', () => {
    const userBox = document.getElementById('userBox');
    const userName = document.getElementById('userName');
    const adminBadge = document.getElementById('adminBadge');
    const adminLink = document.getElementById('adminLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutBtn = document.getElementById('logoutBtn');

    const userData = localStorage.getItem('user');
    console.log("1. Dữ liệu thô từ LocalStorage:", userData);

    if (userData) {
        const user = JSON.parse(userData);
        console.log("2. Dữ liệu sau khi Parse:", user);
        console.log("3. Kiểm tra isAdmin:", user.isAdmin, "Kiểu dữ liệu:", typeof user.isAdmin);

        if (user.name) {
            // Hiện UserBox, ẩn Login/Register
            if (userBox) userBox.style.display = 'flex';
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (userName) userName.innerText = `Hi, ${user.name}`;

            // Kiểm tra Admin (Chấp cả kiểu string lẫn kiểu boolean)
            if (user.isAdmin === true || user.isAdmin === 'true') {
                console.log("=> ĐÃ XÁC NHẬN ADMIN! ĐANG HIỆN TAG...");
                if (adminBadge) adminBadge.style.setProperty('display', 'inline-block', 'important');
                if (adminLink) adminLink.style.setProperty('display', 'inline-block', 'important');
            } else {
                console.log("=> KHÔNG PHẢI ADMIN HOẶC SAI BIẾN isAdmin");
            }
        }
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('user');
            window.location.href = '/index.html';
        };
    }
});