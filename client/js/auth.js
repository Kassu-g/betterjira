document.addEventListener('DOMContentLoaded', function () {     // Handling Reg

    document.getElementById('registerForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      
      // Get forms
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      // Send registration data to backend
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Save the token to localStorage
          localStorage.setItem('authToken', data.token);
          console.log("Stored token:", data.token);
  
          // Redirect to the Kanban Board here
          window.location.href = 'kanban.html';
        } else {
          console.error('Registration failed:', data.message);
          alert('Registration failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function () { // Handling Login here
    
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Save the token to localStorage
          localStorage.setItem('authToken', data.token);
  
          // Redirect to the Kanban Board here
          window.location.href = 'kanban.html';
        } else {
          console.error('Login failed:', data.message);
          alert('Login failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  
  