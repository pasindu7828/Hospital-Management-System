// Login Script

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');
  const loginAlertText = document.getElementById('loginAlertText');

  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'index.html';
    } else {
      loginAlertText.textContent = 'Invalid username or password!';
      loginAlert.classList.remove('d-none');
    }
  });
});
