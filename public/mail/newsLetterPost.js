'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const newsLetterSubcriber = document.getElementById('newsLetterSubcriberForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const emailField = document.querySelector('input[name="subscriberEmail"]');
    const emailErrorElement = document.getElementById('subscriberEmailError');
    const submitButton = document.getElementById('submitButton');
    let emailAlreadySubscribed = false;

    const footerNewsLetterSubcriber = document.getElementById('footerNewsLetterSubcriberForm');
    const footerThankYouMessage = document.getElementById('footerThankYouMessage');
    const footerEmailField = document.querySelector('#footerNewsLetterSubcriberForm input[name="subscriberEmail"]');
    const footerEmailErrorElement = document.getElementById('footerSubscriberEmailError');
    const footerSubmitButton = document.getElementById('footerSubmitButton');
    let footerEmailAlreadySubscribed = false;

    // Function to check if email already exists asynchronously
    async function checkExistingNewLetterUser(field, value) {
        try {
            const response = await fetch(`/checkExistingNewLetterUser?field=${field}&value=${encodeURIComponent(value)}`);
            const data = await response.json();
            return data; // Return the response data directly
        } catch (error) {
            // console.error('Error checking existing user:', error);
            return { exists: false, message: 'An error occurred while checking existing user' };
        }
    }

    // Add event listener to email input field in main content area form
    emailField.addEventListener('input', async () => {
        const email = emailField.value.trim();
        if (email) {
            const { exists, message } = await checkExistingNewLetterUser('subscriberEmail', email);
            if (exists) {
                emailErrorElement.textContent = message;
                submitButton.disabled = true; // Disable submit button
                emailAlreadySubscribed = true;
            } else {
                emailErrorElement.textContent = '';
                submitButton.disabled = false; // Enable submit button
                emailAlreadySubscribed = false;
            }
        }
    });

    // Add event listener to form submission in main content area form
    newsLetterSubcriber.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        if (emailAlreadySubscribed) {
            // If email is already subscribed, display a message and return
            emailErrorElement.textContent = 'Subscriber email has already subscribed.';
            return;
        }

        // Change the appearance of the submit button to show a spinner
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        submitButton.disabled = true; // Disable the button while submitting

        try {
            // Get form data
            const formData = Object.fromEntries(new FormData(newsLetterSubcriber));

                 // Determine the action URL based on the current page URL
            const actionURL = window.location.pathname.startsWith('/user') ? '/user/newsLetterSubcriber' : '/newsLetterSubcriber';

            const response = await fetch(actionURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // If registration successful, redirect or show success message
                newsLetterSubcriber.reset(); // Reset the form after successful submission
                newsLetterSubcriber.style.display = 'none'; // Hide the form
                thankYouMessage.style.display = 'block'; // Show the thank you message
            } else {
                // If registration failed, display error messages
                const errors = data.errors;
                errors.forEach(error => {
                    const errorElement = document.getElementById(`${error.key}Error`);
                    if (errorElement) {
                        errorElement.textContent = error.msg;
                    }
                });
            }
        } catch (error) {
            // console.error('Error:', error);
            // Handle other errors, like network issues
            alert('An error occurred while processing your request.');
        } finally {
            // Restore the appearance of the submit button
            submitButton.innerHTML = 'Submit';
            submitButton.disabled = false; // Re-enable the button
        }
    });

    // Add event listener to each input field in main content area form to clear error messages
    const inputFields = newsLetterSubcriber.querySelectorAll('input, select'); // Get all input and select fields in the main content area form
    inputFields.forEach(inputField => {
        inputField.addEventListener('input', () => {
            const fieldName = inputField.name;
            const errorElement = document.getElementById(fieldName + 'Error');
            if (errorElement) {
                // Clear the error message associated with the input field
                errorElement.innerText = '';
            }
        });
    });

    // Add event listener to email input field in footer form
    footerEmailField.addEventListener('input', async () => {
        const email = footerEmailField.value.trim();
        if (email) {
            const { exists, message } = await checkExistingNewLetterUser('subscriberEmail', email);
            if (exists) {
                footerEmailErrorElement.textContent = message;
                footerSubmitButton.disabled = true; // Disable submit button
                footerEmailAlreadySubscribed = true;
            } else {
                footerEmailErrorElement.textContent = '';
                footerSubmitButton.disabled = false; // Enable submit button
                footerEmailAlreadySubscribed = false;
            }
        }
    });

    // Add event listener to form submission in footer form
    footerNewsLetterSubcriber.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        if (footerEmailAlreadySubscribed) {
            // If email is already subscribed, display a message and return
            footerEmailErrorElement.textContent = 'Subscriber email has already subscribed.';
            return;
        }

        // Change the appearance of the submit button to show a spinner
        footerSubmitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        footerSubmitButton.disabled = true; // Disable the button while submitting

        try {
            // Get form data
            const formData = Object.fromEntries(new FormData(footerNewsLetterSubcriber));

            // Send form data to server using AJAX
            const response = await fetch('/newsLetterSubcriber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // If registration successful, redirect or show success message
                footerNewsLetterSubcriber.reset(); // Reset the form after successful submission
                footerNewsLetterSubcriber.style.display = 'none'; // Hide the form
                footerThankYouMessage.style.display = 'block'; // Show the thank you message
            } else {
                // If registration failed, display error messages
                const errors = data.errors;
                errors.forEach(error => {
                    const errorElement = document.getElementById(`${error.key}Error`);
                    if (errorElement) {
                        errorElement.textContent = error.msg;
                    }
                });
            }
        } catch (error) {
            // console.error('Error:', error);
            // Handle other errors, like network issues
            alert('An error occurred while processing your request.');
        } finally {
            // Restore the appearance of the submit button
            footerSubmitButton.innerHTML = 'Submit';
            footerSubmitButton.disabled = false; // Re-enable the button
        }
    });

    // Add event listener to each input field in footer form to clear error messages
    const footerInputFields = footerNewsLetterSubcriber.querySelectorAll('input, select'); // Get all input and select fields in the footer form
    footerInputFields.forEach(inputField => {
        inputField.addEventListener('input', () => {
            const fieldName = inputField.name;
            const errorElement = document.getElementById('footer' + fieldName + 'Error');
            if (errorElement) {
                // Clear the error message associated with the input field
                errorElement.innerText = '';
            }
        });
    });
});
