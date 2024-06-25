'use strict';
document.addEventListener('DOMContentLoaded', function () {
    // console.log('Client-side script loaded.');
    const reviewForm = document.getElementById('reviewForm');
    const reviewThankYouMessage = document.getElementById('reviewThankYouMessage');
    const starIcons = document.querySelectorAll('.fa-star');
    const ratingInput = document.getElementById('reviewRating'); // Hidden input field for rating

    // Add event listener to each star icon
    starIcons.forEach(starIcon => {
        starIcon.addEventListener('click', function () {
            const selectedRating = parseInt(this.dataset.rating);

            // Fill clicked star and empty remaining stars
            starIcons.forEach(icon => {
                const iconRating = parseInt(icon.dataset.rating);
                if (iconRating <= selectedRating) {
                    icon.classList.add('fas'); // Fill star
                    icon.classList.remove('far'); // Remove empty star
                } else {
                    icon.classList.add('far'); // Empty star
                    icon.classList.remove('fas'); // Remove filled star
                }
            });

            // Update hidden input field with selected rating
            ratingInput.value = selectedRating;
        });
    });

    reviewForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = document.getElementById('sendReviewMessage');
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        submitButton.disabled = true;

        try {
           
              // Get the productId from the URL
              const urlParams = new URLSearchParams(window.location.search);
              const productId = urlParams.get('productId');

            // Create a FormData object from the reviewForm
            const formData = new FormData(reviewForm);


            // console.log('Sending request to server...');
            const response = await fetch(`/productReviewMsg/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            if (data.success) {
                reviewForm.reset(); // Reset the form after successful submission
                reviewForm.style.display = 'none'; // Hide the form
                reviewThankYouMessage.style.display = 'block'; // Show the thank you message
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
            submitButton.innerHTML = 'Send Message';
            submitButton.disabled = false;
        }
    });

    // Add event listener to each star icon
    starIcons.forEach(starIcon => {
        starIcon.addEventListener('click', () => {
           // Clear error message for star rating
           const errorElement = document.getElementById('reviewRatingError');
           if (errorElement) {
            errorElement.innerText = '';
           }
       });
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
