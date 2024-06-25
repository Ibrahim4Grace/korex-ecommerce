'use strict';
// uploadingn user and merhant profile image
document.getElementById('profile-picture-input').addEventListener('change', function(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profile-picture').src = e.target.result;
    };
    reader.readAsDataURL(file);

     // Determine the upload URL based on the data-url attribute of the input element
    let uploadUrl = this.getAttribute('data-url');
    
    // After uploading the image successfully, send it to the server using AJAX
    let formData = new FormData();
    formData.append('image', file);
    
    fetch(uploadUrl, { 
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error uploading image:', response.statusText);
        }
    })
    .then(data => {
        window.location.href = data.callbackUrl;
    })
    .catch(error => console.error('Error uploading image:', error));
});
