 const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

    productName:{ type:String, required:true},
    productDescription:{ type:String, required:true},
    productPrice:{ type:String, required:true},
    productOldPrice:{ type:String,},
    productShipping:{ type:String, required:true},
    productCategory:{ type:String, required:true},
    productBrand:{ type:String, required:true},
    productSize:{ type: [String], required:true},
    productColor:{ type: [String], required:true},
    productQuantity:{ type:Number, required:true},
    productGender:{ type:String, required:true},
    images: [{
        imageUrl: String,
        imageId: String
    }],
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    
    reviews: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        userFirstName: {
            type: String,
        },
        userLastName: {
            type: String,
        },
        reviewRating: {
            type: Number,
        },
        reviewMessage: {
            type: String,
        },
        date_added: {
            type: Date,
            default:Date.now()
        }
    }],
    discount: {
        type: Number
    },
    date_added:{
        type:Date,
        default:Date.now()
    }

})

// Virtual property to calculate stock status
productSchema.virtual('stockStatus').get(function () {
    if (this.productQuantity === 0) {
        return 'Out of Stock';
    } else if (this.productQuantity < 3) {
        return 'Low Stock';
    } else {
        return 'In Stock';
    }
});

// Method to decrement product quantity
productSchema.methods.decrementQuantity = function (quantityToDecrement) {
    this.productQuantity -= quantityToDecrement;
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports =  Product


