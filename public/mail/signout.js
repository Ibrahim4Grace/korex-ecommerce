'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const signOutLinks = document.querySelectorAll('.signOutLink');

    signOutLinks.forEach(signOutLink => {
        signOutLink.addEventListener('click', async function(event) {
            event.preventDefault();

            const signoutUrl = this.getAttribute('data-url');

            try {
                const response = await fetch(signoutUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    window.location.href = data.logoutRedirectUrl;
                } else {
                    const data = await response.json();
                    displayErrorMessage(data.message);
                }
            } catch (error) {
                displayErrorMessage('An error occurred. Please try again later.');
            }
        });
    });

    function displayErrorMessage(message) {
        const errorMessageElement = document.getElementById('message');
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
            errorMessageElement.style.display = 'block';
        } else {
            alert(message);
        }
    }
});
