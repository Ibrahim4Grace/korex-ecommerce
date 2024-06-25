'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const reportSeller = document.getElementById('reportSellerForm');
    const thankYouMessage = document.getElementById('thankYouMsg');

    reportSeller.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = document.getElementById('sendReportBton');
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        submitButton.disabled = true;

        try {
     
            const formData = new FormData(this);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput.files.length > 0) {
                formData.append('image', fileInput.files[0]);
            }

            const response = await fetch('/user/reportSeller', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                reportSeller.reset(); // Reset the form after successful submission
                reportSeller.style.display = 'none'; // Hide the form
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
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        } finally {
            submitButton.innerHTML = 'Submit';
            submitButton.disabled = false;
        }
    });

    // Add event listener to each input field to clear error messages
    const inputFields = document.querySelectorAll('input, textarea');
    inputFields.forEach(inputField => {
        inputField.addEventListener('input', () => {
            const fieldName = inputField.name;
            const errorElement = document.getElementById(`${fieldName}Error`);
            if (errorElement) {
                errorElement.innerText = '';
            }
        });
    });
});


