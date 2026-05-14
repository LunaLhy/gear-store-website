const API_REGISTER_URL = 'http://localhost:5000/api/users/register'; 

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert('Please fill the missing information');
        return;
    }

    if (password.length < 6) {
        alert('password length must be > 6 letter');
        return;
    }

    const registerData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch(API_REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Register sucessful! redirecting you to the login page!');
            
            window.location.href = 'login.html'; 
        } else {
            alert(data.message || 'Error, try again');
        }

    } catch (error) {
        console.error('Lỗi kết nối API Register:', error);
        alert('Error');
    }
}