const {Product, Order} = require('../models');
const logger = require('../logger/logger'); 


// Total products (optionally for a specific merchant)
const getTotalProducts = async (merchantId = null) => {
    try {
        const filter = merchantId ? { merchantId: merchantId } : {};
        const totalCount = await Product.countDocuments(filter);
        return totalCount;
    } catch (error) {
        logger.error('Error counting total products:', error);
        return 0; // Return 0 in case of error
    }
};

//Total orders
const getTotalOrder = async (merchantId = null) => {
    try {
        const filter = merchantId ? { 'cartItems.merchantId': merchantId } : {};
        const totalCounts = await Order.countDocuments(filter);
        return totalCounts;
    } catch (error) {
        logger.error('Error counting total order:', error);
        return 0; // Return 0 in case of error
    }
};

//Total sales
const getTotalOrderAmount = async (merchantId = null) => {
    try {
        // Define the match stage based on whether merchantId is provided
        const matchStage = merchantId ? { 'cartItems.merchantId': merchantId } : {};

        const totalAmountResult = await Order.aggregate([
            // Unwind cartItems to deal with individual items
            { $unwind: '$cartItems' },
            // Apply match stage if merchantId is specified
            { $match: matchStage },
            // Group by null (we want a single result with the total amount)
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: { $toDouble: '$totalAmount' } } 
                } 
            }
        ]);

        // If the result is not empty, return the totalAmount, otherwise return 0
        const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
        return totalAmount;
    } catch (error) {
        logger.error('Error calculating total order amount:', error);
        return 0; // Return 0 in case of error
    }
};



module.exports = {getTotalProducts, getTotalOrder, getTotalOrderAmount};

