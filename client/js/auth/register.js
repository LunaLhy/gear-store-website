document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm')?.addEventListener('submit', register);
});

async function register(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (password.length < 6) return alert('Password must be at least 6 characters');

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Register failed');

    alert('Register successful! Redirecting to login page.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Register error:', error);
    alert('Try again later');
  }
}
