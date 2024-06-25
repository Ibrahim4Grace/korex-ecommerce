'use strict';
// Refresh token function
async function refreshToken() {
    try {
        const response = await fetch('/auth/merchantRefreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensure cookies are sent with the request
        });

        if (response.ok) {
            const data = await response.json();
            // Update your access token in your application state
            sessionStorage.setItem('merchantAccessToken', data.merchantAccessToken);
        } else {
            console.error('Failed to refresh token');
            const errorMessageElement = document.getElementById('successMessageContainer');
            if (response.status === 401 || response.status === 403) {
                errorMessageElement.innerText = 'Unauthorized access. Please log in again.';
                window.location.href = '/auth/merchant/merchantLogin';
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

document.getElementById('merchantLoginForm').addEventListener('submit', async function(event) {
    setupTokenRefreshInterval();

    event.preventDefault(); 
    const formData = new FormData(event.target);

    const merchantUsername = formData.get('merchantUsername');
    const merchantPassword = formData.get('merchantPassword');

    try {
        const response = await fetch('/auth/merchant/merchantLoginPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ merchantUsername, merchantPassword })
        });

        if (response.ok) {
            const responseData = await response.json();
            // console.log(responseData)
            if (responseData.success) {
        
                 // Redirect to the URL returned by the server after successful login
                window.location.href = responseData.merchantRedirectUrl;
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
        // console.error('Error during login:', error);
        alert('Error during login. Please try again later.');    
    }

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
    



//  JavaScript to extract and display success or error message 
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('successMessage');
    const authErrorMessage = urlParams.get('authErrorMessage');

    const message = successMessage || authErrorMessage;

    if (message) {
        // Display the message in the container
        const messageContainer = document.getElementById('successMessageContainer');
        messageContainer.textContent = decodeURIComponent(message);

        // Clear the message after a certain time interval (e.g., 5 seconds)
        setTimeout(function() {
            clearMessage(messageContainer);
        }, 5000); 
    }
});

function clearMessage(element) {
     // Clear the content of the message container
    element.textContent = '';
}
 
