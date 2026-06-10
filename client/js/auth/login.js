document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm')?.addEventListener('submit', login);
});

async function login(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Wrong email or password');

    localStorage.setItem('user', JSON.stringify(data));
    if (data.token) localStorage.setItem('token', data.token);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Try again later');
  }
}
