'use strict';

// Function to show the loading spinner and hide the "Place Order" button
function showLoadingSpinner() {
    const placeOrderButton = document.getElementById('placeOrderButton');
    placeOrderButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Placing Order...';
    placeOrderButton.disabled = true;
}

// Function to hide the loading spinner and show the "Place Order" button
function hideLoadingSpinner() {
    const placeOrderButton = document.getElementById('placeOrderButton');
    placeOrderButton.innerHTML = 'Place Order';
    placeOrderButton.disabled = false;
}

document.addEventListener("DOMContentLoaded", function() {

    // Function to show the loading spinner on the "Submit Order" button
    function showSubmitOrderSpinner() {
        const submitOrderButton = document.getElementById('submitOrderButton');
        submitOrderButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting Order...';
        submitOrderButton.disabled = true;
    }

     // Function to hide the payment section
    function hidePaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        const cardSection = document.getElementById('card-section');
        paymentSection.style.display = 'none';
        cardSection.style.display = 'none';
    }

    // Function to show the Submit Order button
    function showSubmitOrderButton() {
        const placeOrderButton = document.getElementById('placeOrderButton');
        const submitOrderButton = document.getElementById('submitOrderButton');
        placeOrderButton.style.display = 'none';
        submitOrderButton.style.display = 'block';
        hidePaymentSection(); 
    }

    // Function to show the Shipping Address and checkbox section
    function showShippingAddressSection() {
        const shiptoContainer = document.getElementById('shipto-container');
        shiptoContainer.style.display = 'block';
    }

    // If the URL contains the Paystack callback parameters, hide the "Place Order" button and show the "Submit Order" button
    if (window.location.href.includes("trxref") && window.location.href.includes("reference")) {
        showSubmitOrderButton();
        showShippingAddressSection();  // Also, show the Shipping Address section
    }

    // Attach onclick event listener to the button after DOMContentLoaded
    let placeOrderButton = document.getElementById("placeOrderButton");
    placeOrderButton.addEventListener("click", initializePayment);

    async function initializePayment() {
        try {
              // Show the loading spinner
              showLoadingSpinner();

            let orderTotalAmount = document.getElementById("totalAmount").innerText;
            let totalAmountWithoutDollar = orderTotalAmount.replace('$', '');
            let totalAmountInNaira = parseFloat(totalAmountWithoutDollar); 
            let formattedAmount = totalAmountInNaira.toFixed(2);
            let totalAmountInKobo = formattedAmount * 100; // Convert the formatted amount to kobo
            let email = document.getElementById("userEmail").value;
            let id = document.getElementById("userId").value;

            // Send a POST request to initialize the transaction
            const response = await fetch(`/initializeTrans/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, amount: totalAmountInKobo })
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.data.authorization_url;

                // Wait 1mins before checking if the payment is successful
                setTimeout(checkPaymentStatus, 60000);
            } else {
                console.error('Failed to initialize transaction');
            }
        } catch (error) {
            console.error('Error initializing payment:', error);
        }
    }


    //Verifying payment status
    async function checkPaymentStatus() {
        try {
            let id = document.getElementById("userId").value;

            const verifyResponse = await fetch(`/verifytransaction/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if the request was successful
            if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();

                // Redirect based on payment status
                if (verifyData.status) { // Check if status is true
                    showSubmitOrderButton(); // Show the submit order button
                    showShippingAddressSection(); // Show the shipping address section
                } else {
                    window.location.href = '/user/failed'; 
                }
            } else {
                console.error('Failed to verify payment');
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    }


     // Submit order button event listener
    const submitOrderButton = document.getElementById('submitOrderButton');
    submitOrderButton.addEventListener('click', async function(event) {
        event.preventDefault();
        showSubmitOrderSpinner();
        
        // Gather shipping address information
        const shippingAddress = {
            firstName: document.querySelector('input[name="receiverFirstName"]').value,
            lastName: document.querySelector('input[name="receiverLastName"]').value,
            email: document.querySelector('input[name="receiverEmail"]').value,
            mobileNumber: document.querySelector('input[name="receiverNumber"]').value,
            addressLine1: document.querySelector('input[name="receiverAddress"]').value,
            city: document.querySelector('input[name="receiverCity"]').value,
            state: document.querySelector('input[name="receiverState"]').value,
            country: document.querySelector('select[name="receiverCountry"]').value
        };

        // Gather cart items information
        const cartItems = [];
        const productContainers = document.querySelectorAll('.product-list-container > div');
        productContainers.forEach(container => {
            const productName = container.querySelector('#productName').textContent;
            const productPrice = container.querySelector('p:last-child').textContent;
            const productQuantity = container.querySelector('#productQuantity').textContent.trim().replace('Qty: ', '');
            const productColor = container.querySelector('#productColor').textContent.trim().replace('Col: ', '');
            const productSize = container.querySelector('#productSize').textContent.trim().replace('Size: ', '');
            const productID = container.querySelector('#productID').value;
            const productImages = [];
            container.querySelectorAll('img').forEach(img => {
                productImages.push(img.getAttribute('src'));
            });
        
            cartItems.push({ productName, productPrice,productQuantity,productColor,productSize,productID,productImages });
        });

           // Gather order total information
        const subtotal = parseFloat(document.querySelector('.Subtotal > h6 > p').textContent.replace('$', ''));
        const totalShipping = parseFloat(document.querySelector('.totalShipping > h6:last-child').textContent.replace('$', ''));
        const totalAmount = parseFloat(document.querySelector('.totalAmount > h5:last-child').textContent.replace('$', ''));

        // Prepare data to send to the server
        const orderData = { shippingAddress,cartItems,subtotal,totalShipping,totalAmount };

        try {
            const response = await fetch('/submitOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (response.ok) {
                const responseData = await response.json();
          
                if (responseData.successPageUrl) {
                    window.location.href = responseData.successPageUrl;
                } else {
                    console.error('Success page URL not provided in the response');
                }
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message); 
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    });
});
