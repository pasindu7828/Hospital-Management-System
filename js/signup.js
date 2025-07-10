// Signup Script

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const signupAlert = document.getElementById('signupAlert');
  const signupAlertText = document.getElementById('signupAlertText');
  const signupSuccess = document.getElementById('signupSuccess');
  const signupSuccessText = document.getElementById('signupSuccessText');

  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const users = getUsers();
    if (!username || !password || !confirmPassword) {
      signupAlertText.textContent = 'All fields are required!';
      signupAlert.classList.remove('d-none');
      signupSuccess.classList.add('d-none');
      return;
    }
    if (users.find(u => u.username === username)) {
      signupAlertText.textContent = 'Username already exists!';
      signupAlert.classList.remove('d-none');
      signupSuccess.classList.add('d-none');
      return;
    }
    if (password !== confirmPassword) {
      signupAlertText.textContent = 'Passwords do not match!';
      signupAlert.classList.remove('d-none');
      signupSuccess.classList.add('d-none');
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    signupAlert.classList.add('d-none');
    signupSuccessText.textContent = 'Signup successful! You can now login.';
    signupSuccess.classList.remove('d-none');
    signupForm.reset();
  });
});
