function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('isAdmin', true);
            window.location.href = 'admin.html';  // Redirect to dashboard
        } else {
            document.getElementById('error-message').textContent = 'Invalid credentials';
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById('error-message').textContent = 'Login failed';
    });
    
}
function handleAdminClick() {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin) {
        // Already logged in → go to dashboard
        window.location.href = 'admin.html';
    } else {
        // Not logged in → go to login page
        window.location.href = 'login.html';
    }
}
function togglePassword() {
    const pwd = document.getElementById('password');
    pwd.type = pwd.type === 'password' ? 'text' : 'password';
}

