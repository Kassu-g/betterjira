document.addEventListener('DOMContentLoaded', function () {
    // Handling Registration
    document.getElementById('registerForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      // Send registration data to the backend
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
          console.log("Stored token:", data.token); // Debugging
  
          // Redirect to the Kanban Board
          window.location.href = 'kanban.html';  // Ensure kanban.html exists
        } else {
          console.error('Registration failed:', data.message);
          alert('Registration failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  