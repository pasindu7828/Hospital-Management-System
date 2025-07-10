// You can add common JavaScript here for all pages
console.log("Hospital Management System loaded.");

// Session check for protected pages
if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('signup.html')) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}

// Logout handler
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
  }
}

// Attach logout to button if present
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// This file is used for global helpers if needed.
// Bootstrap alert stacking is handled in each page's script.
