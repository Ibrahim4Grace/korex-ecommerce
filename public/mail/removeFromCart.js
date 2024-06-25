'use strict';
document.addEventListener('DOMContentLoaded', function () {

    // Function to update the UI with subtotal
    function updateSubtotal(subtotal) {
        const subtotalElement = document.getElementById('subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2);
        }
    }

    // Function to update the UI with total shipping charges
    function updateTotalShipping(totalShipping) {
        const totalShippingElement = document.getElementById('totalShipping');
        if (totalShippingElement) {
            totalShippingElement.textContent = totalShipping.toFixed(2);
        }
    }

    // Function to update the UI with total amount
    function updateTotalAmount(totalAmount) {
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toFixed(2);
        }
    }


    // Add event listeners for Remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', async function(event) {

            event.preventDefault();

            // Ask for confirmation
            if (!confirm("Are you sure you want to remove this item?")) {
                return; // If the user cancels, do nothing
            }

            const form = this.closest('.remove-item-form');

            // Retrieve the data-url attribute from the form
            const url = form.dataset.url || '/removeFromCart';

            const productIdInput = form.querySelector('input[name="productId"]');

            const productId = productIdInput.value; // This should correctly retrieve the product ID


            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId: productId }) // Include productId in the request body
                });

                // console.log("Response status:", response.status);

                if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                }

                const data = await response.json();

                if (data.success) {
                    // Remove the item from the cart list display
                    const removedItemElement = this.closest('tr'); // Assuming the item is in a table row
                    removedItemElement.remove();

                    // Recalculate subtotal, total shipping, and total amount
                    updateSubtotal(data.subtotal);
                    updateTotalShipping(data.totalShipping);
                    updateTotalAmount(data.totalAmount);

                } else {
                    alert(data.message);
                }
    
            } catch (error) {
                // console.error('Error:', error);
                alert('An error occurred while processing your request.');
            }
        });
    });
});




