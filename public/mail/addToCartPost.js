'use strict';
        document.addEventListener('DOMContentLoaded', function () {
            const addToCartButtons = document.querySelectorAll('.addToCart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', async function(event) {
                    event.preventDefault();
                    const productId = this.getAttribute('data-product-id');
                    const url = this.getAttribute('data-url'); 

                      // Find the closest form or container containing the color, size, and quantity inputs
                    const container = this.closest('.product-item, .col-lg-7, .card');
                    if (!container) {
                        console.error('Container not found for the clicked button.');
                        return;
                    }

                    // Get selected color and size, if present
                    const selectedColorInput = container.querySelector('input[name="Colors"]:checked');
                    const selectedSizeInput = container.querySelector('input[name="size"]:checked');
                    const quantityInput = container.querySelector('#quantity');

                    const selectedColor = selectedColorInput ? selectedColorInput.value : 'Black';
                    const selectedSize = selectedSizeInput ? selectedSizeInput.value : 'M';
                    const quantity = quantityInput ? quantityInput.value : 1;

                    try {
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ 
                                    productId: productId,
                                    selectedColor: selectedColor,
                                    selectedSize: selectedSize,
                                    quantity:quantity
                                })
                             });

                        const data = await response.json();

                        if (data.success) {
                            // Update cart count
                            const cartCountElement = document.getElementById('productsInCart');
                            if (cartCountElement) {
                                const currentCount = parseInt(cartCountElement.textContent.trim());
                                if (!isNaN(currentCount)) {
                                    cartCountElement.textContent = currentCount + 1;
                                } else {
                                        // If current count is not a valid number, set count to 1
                                    cartCountElement.textContent = 1;
                                }
                            }
                        } else {
                            if (data.message === 'Item is already in the cart') {
                                alert(data.message);
                            } else {
                                alert(data.message);
                            }
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('An error occurred while processing your request.');
                    }
                });
            });
        });

