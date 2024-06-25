'use strict';
// Refresh token function
async function refreshToken() {
    try {
        const response = await fetch('/auth/adminRefreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensure cookies are sent with the request
        });

        if (response.ok) {
            const data = await response.json();
            // Update your access token in your application state
            sessionStorage.setItem('adminAccessToken', data.adminAccessToken);
        } else {
            console.error('Failed to refresh token');
            const errorMessageElement = document.getElementById('message');
            if (response.status === 401 || response.status === 403) {
                errorMessageElement.innerText = 'Unauthorized access. Please log in again.';
                window.location.href = '/auth/admin/login';
            } else {
                errorMessageElement.innerText = 'Failed to refresh token. Please try again later.';
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example function to call refreshToken periodically 3hrs
function setupTokenRefreshInterval() {
    const refreshInterval = 3 * 60 * 60 * 1000;
    setInterval(refreshToken, refreshInterval);
}

    document.addEventListener('DOMContentLoaded', () => {
        setupTokenRefreshInterval();

        const adminLoginForm = document.getElementById('adminLoginForm');
        adminLoginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
    
            const submitButton = document.getElementById('submitButton');
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
            submitButton.disabled = true;
    
            try {
                const formData = Object.fromEntries(new FormData(adminLoginForm));
    
                const response = await fetch('/auth/admin/adminLoginPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                const data = await response.json();
                if (data.success) {
                    window.location.href = data.adminRedirectUrl;
                } else {
                    const errorMessageElement = document.getElementById('message');
                    if (errorMessageElement) {
                        errorMessageElement.textContent = data.message;
                        errorMessageElement.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while processing your request.');
            } finally {
                submitButton.innerHTML = 'Login';
                submitButton.disabled = false;
            }
        });
    
        const inputFields = document.querySelectorAll('input, select');
        inputFields.forEach(inputField => {
            inputField.addEventListener('input', () => {
                const errorMessageElement = document.getElementById('message');
                if (errorMessageElement) {
                    errorMessageElement.innerText = '';
                    errorMessageElement.style.display = 'none';
                }
            });
        });

          // JavaScript to toggle and display password message
    document.querySelectorAll('.toggle-password').forEach(togglePassword => {
        togglePassword.addEventListener('click', function () {
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
            const input = document.querySelector(this.getAttribute("toggle"));
            if (input.getAttribute("type") === "password") {
                input.setAttribute("type", "text");
            } else {
                input.setAttribute("type", "password");
            }
        });
    });


    });
    
  
    