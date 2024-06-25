'use strict';
// Refresh token function
async function refreshToken() {
    try {
        const response = await fetch('/auth/userRefreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensure cookies are sent with the request
        });

        if (response.ok) {
            const data = await response.json();
            // Update your access token in your application state
            sessionStorage.setItem('userAccessToken', data.userAccessToken);
        } else {
            console.error('Failed to refresh token');
            const errorMessageElement = document.getElementById('successMessageContainer');
            if (response.status === 401 || response.status === 403) {
                errorMessageElement.innerText = 'Unauthorized access. Please log in again.';
                window.location.href = '/auth/user/login';
            } else {
                errorMessageElement.innerText = 'Failed to refresh token. Please try again later.';
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example function to call refreshToken periodically
function setupTokenRefreshInterval() {
    const refreshInterval = 3 * 60 * 60 * 1000;
    setInterval(refreshToken, refreshInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    setupTokenRefreshInterval();
    
    const successMessageContainer = document.getElementById('successMessageContainer');

    document.getElementById('userLoginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const userUsername = formData.get('userUsername');
        const userPassword = formData.get('userPassword');

        try {
            const response = await fetch('/auth/user/userLoginPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userUsername, userPassword })
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    window.location.href = responseData.userAuthRedirectUrl;
                } else {
                    // If login unsuccessful, display error message
                    displayErrorMessage(responseData.message);
                }
            } else {
                // Handle other HTTP response statuses (e.g., 400 Bad Request)
                const responseData = await response.json();
                displayErrorMessage(responseData.message);
            }
        } catch (error) {
            console.error('An error occurred. Please try again later.');
        }
    });

    function displayErrorMessage(message) {
        // Clear any previous content in successMessageContainer
        successMessageContainer.innerHTML = '';
        // Create and append error message to successMessageContainer
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'error-message';
        errorMessageElement.textContent = message;
        successMessageContainer.appendChild(errorMessageElement);
    }
});

    
       // JavaScript to toggle and display password message 
         $(".toggle-password").click(function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            let input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });


         //  JavaScript to extract and display success message 
         document.addEventListener("DOMContentLoaded", function() {
            const urlParams = new URLSearchParams(window.location.search);
            const successMessage = urlParams.get('successMessage');
            if (successMessage) {
               // Display the success message in the container
               const successMessageContainer = document.getElementById('successMessageContainer');
               successMessageContainer.textContent = decodeURIComponent(successMessage);

               // Clear the success message after a certain time interval (e.g., 5 seconds)
               setTimeout(function() {
                clearSuccessMessage();
            }, 5000); 
        }
    });

    function clearSuccessMessage() {
        const successMessageContainer = document.getElementById('successMessageContainer');
           // Clear the content of the success message container
        successMessageContainer.innerHTML = '';
    }
    

