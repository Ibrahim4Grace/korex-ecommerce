'use strict';

document.addEventListener('DOMContentLoaded', async function () {
  // Function to update quantity and total amount via AJAX
  async function updateQuantity(url, productId, quantity) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response from the backend
        if (data && data.message) {
          // Display the error message received from the server
          alert(data.message);
        } else {
          throw new Error('Failed to update quantity');
        }
      } else {
        // Update the displayed totalAmount,subtotal, after updating the quantity
        updateProductTotalAmount(productId, data.productTotalAmount);
        updateSubtotal(data.subtotal);
        updateTotalShipping(data.totalShipping);
        updateTotalAmount(data.totalAmount);

        // Function to update the product total amount in the UI
        function updateProductTotalAmount(productId, productTotalAmount) {
          const productTotalAmountElement = document.getElementById(
            `productTotalAmount_${productId}`
          );
          if (productTotalAmountElement) {
            productTotalAmountElement.textContent =
              productTotalAmount.toFixed(2);
          }
        }

        // Function to update the UI with subtotal
        function updateSubtotal(subtotal) {
          const subtotalElement = document.getElementById('subtotal');
          if (subtotalElement) {
            subtotalElement.textContent = data.subtotal.toFixed(2);
          }
        }
        // Function to update the UI with total shipping charges
        function updateTotalShipping(totalShipping) {
          const totalShippingElement = document.getElementById('totalShipping');
          if (totalShippingElement) {
            totalShippingElement.textContent = data.totalShipping.toFixed(2);
          }
        }
        // Function to update the UI with total amount
        function updateTotalAmount(totalAmount) {
          const totalAmountElement = document.getElementById('totalAmount');
          if (totalAmountElement) {
            totalAmountElement.textContent = data.totalAmount.toFixed(2);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error');
    }
  }

  // each quantity update is handled sequentially, I disable the  & minus button temporarily
  //while an AJAX request is in progress
  // Add event listeners for plus buttons
  document.querySelectorAll('.btn-plus').forEach((button) => {
    button.addEventListener('click', async function () {
      const input =
        this.closest('.input-group').querySelector('.quantity-input');
      let quantity = parseInt(input.value) || 0;
      const maxQuantity = 10;
      if (!isNaN(quantity) && quantity < maxQuantity) {
        quantity + 1;
        input.value = quantity;
        const productId = input.dataset.productId;
        const url = input.dataset.url || '/updateQuantity';

        // Disable the plus button temporarily
        this.disabled = true;

        try {
          await updateQuantity(url, productId, quantity); // Update quantity via AJAX
        } catch (error) {
          // Handle errors if any
          alert('Error updating quantity');
        } finally {
          // Re-enable the plus button after the request completes
          this.disabled = false;
        }
      }
    });
  });

  // Add event listeners for minus buttons
  document.querySelectorAll('.btn-minus').forEach((button) => {
    button.addEventListener('click', async function () {
      const input =
        this.closest('.input-group').querySelector('.quantity-input');
      let quantity = parseInt(input.value);
      if (quantity <= 0) {
        alert('Quantity cannot be less than 1.');
      } else {
        quantity - 1;
        input.value = quantity; // Update the input field with the new quantity
        const productId = input.dataset.productId;
        // console.log("productId:", productId);
        const url = input.dataset.url || '/updateQuantity';

        // Disable the minus button temporarily
        this.disabled = true;

        try {
          await updateQuantity(url, productId, quantity); // Update quantity via AJAX
        } catch (error) {
          // Handle errors if any
          console.error('Error updating quantity:', error);
        } finally {
          // Re-enable the minus button after the request completes
          this.disabled = false;
        }
      }
    });
  });
});
