'use strict';

document.getElementById('EditAdminProfileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const submitButton = document.getElementById('submit_button');
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> updating profile...';

    try {
        const response = await fetch('/admin/editAdminProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Reset the submit button text
        submitButton.innerHTML = 'Update Profile';
    }
});