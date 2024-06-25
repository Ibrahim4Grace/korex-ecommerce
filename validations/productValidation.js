const Joi = require('joi');



const productNameMessages = {
    "string.empty": "Product name is required",
    "any.required": "Product name is required",
};
const productDescriptionMessages = {
    "string.empty": "Product description name is required",
    "string.min": "Product description must be at least {#limit} characters",
    'string.max': 'Product description cannot exceed 250 characters',
    "any.required": "Product description name is required",
};
const productPriceMessages = {
    'number.base': 'Product price must be a number',
    'number.min': 'Product must be greater than {#limit}',
    "any.required": "Product price name is required",
};
const productShippingMessages = {
    'number.base': 'Shipping price must be a number',
    'number.min': 'Shipping must be greater than {#limit}',
    "any.required": "Shipping price name is required",
};
const productCategoryMessages = {
    "string.empty": "Product category is required",
    "any.required": "Product category is required",
};
const productBrandMessages = {
    "string.empty": "Product brand name is required",
    "any.required": "Product brand name is required",
};
const productSizeMessages = {
    "string.empty": "Product size is required",
    "any.required": "Product size is required",
};
const productColorMessages = {
    "string.empty": "Product color is required",
    "any.required": "Product color is required",
};
const productQuantityMessages = {
    'number.base': 'Product quantity must be a number',
    'number.min': 'Product quantity be greater than {#limit}',
    "any.required": "Product quantity is required",
};
const productGenderMessages = {
    "string.empty": "Product gender is required",
    "any.required": "Product gender is required",
};


// Define a Joi schema for the product data
const productSchema = Joi.object({
    productName: Joi.string().required().messages(productNameMessages),
    productDescription: Joi.string().min(1).max(250).required().messages(productDescriptionMessages),
    productPrice: Joi.string().min(1).required().messages(productPriceMessages),
    productOldPrice: Joi.string().optional(),
    productShipping: Joi.string().min(1).required().messages(productShippingMessages),  
    productCategory: Joi.string().required().messages(productCategoryMessages),
    productBrand: Joi.string().required().messages(productBrandMessages),
    productSize: Joi.array().required().messages(productSizeMessages),
    productColor: Joi.array().required().messages(productColorMessages), 
    productQuantity: Joi.number().min(0).required().messages(productQuantityMessages), 
    productGender: Joi.string().required().messages(productGenderMessages), 
    images: Joi.array().optional(),
    reviews: Joi.array().items(Joi.object({
        reviewName: Joi.string().optional(),
        reviewRating: Joi.number().optional(),
        reviewMessage: Joi.string().optional(),
    })).optional(),
    discount: Joi.number().optional()
   
});


module.exports =  productSchema;

