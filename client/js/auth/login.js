document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {

                const res = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("user", JSON.stringify(data));
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    window.location.href = "/index.html";
                }

            } catch (error) {
                console.error('Lỗi login:', error);
                alert('Try Again Later');
            }
        });
    }
});