'use strict';
//Update Order status
document.querySelectorAll('.shipment-status-select').forEach(select => {
    select.addEventListener('change', function() {
        const orderId = this.getAttribute('data-order-id');
        const shipmentStatus = this.value;

        fetch('/merchant/orders/updateOrdersStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, shipmentStatus })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert('Error updating shipment status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating shipment status');
        });
    });
});

//Update User status
document.querySelectorAll('.account-status-select').forEach(select => {
    select.addEventListener('change', function() {
        const userId = this.getAttribute('data-user-id');
        const accountStatus = this.value;
        const userType = this.getAttribute('data-user-type'); // 'user' or 'merchant'
        const endpoint = `/admin/${userType}s/updateAccountStatus`;

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, accountStatus,userType  })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert('Error updating account status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating account status');
        });
    });
});

//Delete user account
document.querySelectorAll('.delete-profile-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Display a confirmation dialog
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        
        if (confirmDelete) {
            const userId = this.getAttribute('data-user-id');
            const userType = this.getAttribute('data-user-type'); // 'user' or 'merchant'
            const endpoint = `/admin/deleteUser`;

            fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, userType })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    // Optionally, reload the page or update the UI as needed
                } else {
                    alert('Error deleting user');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting user');
            });
        }
    });
});
