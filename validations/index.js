const userSchema  = require('./userValidation');
const adminSchema  = require('./adminValidation');
const merchantSchema = require('./merchantValidation');
const productSchema = require('./productValidation');
const newsLetterSchema = require('./newsLetterValidation');
const contactUsSchema = require('./contactUsValidation');
const reportSchema = require('./reportSellerValidation');
const productReviewSchema = require('./reviewValidation');

module.exports = { userSchema,adminSchema,merchantSchema,productSchema,newsLetterSchema,contactUsSchema,reportSchema,productReviewSchema };
