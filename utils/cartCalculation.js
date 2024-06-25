'use strict';
const logger = require('../logger/logger'); 
const {Order} = require('../models');

// Function to calculate subtotal, shipping, and total amount for the entire cart
function cartCalculation(cart) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        const quantity = parseInt(item.quantity);
        const price = parseFloat(item.productPrice);

        if (!isNaN(quantity) && !isNaN(price)) {
            return total + (quantity * price);
        } else {
            // Handle invalid quantity or price
            logger.error('Invalid quantity or price for item:', item);
            return total; // Skip this item in the calculation
        }
    }, 0);


     // Calculate total shipping based on product quantity
     const totalShipping = cart.reduce((total, item) => {
        const shippingCost = parseFloat(item.productShipping);
        // Check if shipping cost is a valid number
        if (!isNaN(shippingCost) && !isNaN(item.quantity)) {
            return total + (shippingCost * parseInt(item.quantity));
        } else {
            // Handle invalid shipping cost or quantity
            logger.error('Invalid shipping cost or quantity for item:', item);
            return total; // Skip this item in the calculation
        }
    }, 0);

    // Calculate total amount
    const totalAmount = subtotal + totalShipping;

    return { subtotal, totalShipping, totalAmount };
}


async function generateOrderNumber() {
    let orderNumber;
    let isDuplicate = true;

    // Generate a random string or use a combination of timestamps and user IDs to create a unique order number
    const randomNumber = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now().toString().slice(-6); // Use last 6 digits of current timestamp
    orderNumber = `ORD${timestamp}${randomNumber}`;

    // Check if the generated order number already exists in the database
    while (isDuplicate) {
        const existingOrder = await Order.findOne({ orderNumber });
        if (!existingOrder) {
            isDuplicate = false; // Exit the loop if the order number is unique
        } else {
            // Regenerate the order number if it already exists
            const newRandomNumber = Math.floor(Math.random() * 1000000);
            orderNumber = `ORD${timestamp}${newRandomNumber}`;
        }
    }

    return orderNumber;
}


function formatToTwoDecimal(value) {
    return parseFloat(value).toFixed(2);
}

module.exports = {cartCalculation,generateOrderNumber, formatToTwoDecimal};