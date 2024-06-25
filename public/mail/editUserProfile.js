'use strict';

document
  .getElementById('EditProfileForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
      const response = await fetch('/user/editProfilePage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
