const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,  ref: 'User' },

    shippingAddress: {
        firstName:{ type: String},
        lastName:{ type: String},
        email: { type: String},
        mobileNumber: { type: String},
        addressLine1: { type: String},
        city: { type: String},
        state: { type: String},
        country: { type: String},
    },

    cartItems: [
        {
            productName: { type: String},
            productPrice: { type: String},
            productQuantity: { type: String},
            productColor: { type: String},
            productSize: { type: String},
            productImages: [String],
            productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true }
        }
    ],
    
    subtotal:{ type: String},

    totalShipping: { type: String},

    totalAmount: { type: String},
    
    orderNumber: { type: String},

    paystack_ref: { type: String},

    paymentStatus:{ type: String},

    shipmentStatus:{ type: String, default: 'Processing'},

    date_added: { type: Date, default:Date.now() },
    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
