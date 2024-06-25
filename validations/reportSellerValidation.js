const Joi = require('joi');

const productUrlMessages = {
    "string.empty": "Product url is required",
    "any.required": "Product url  is required",
};
const reportGoodsTypeMessages = {
    "string.empty": "Type of issue is required",
    "any.required": "Type of issue  is required",
};
const reasonForReportMessages = {
    "string.empty": "Reason why you reporting is required",
    "string.max": "Reason why you reporting message cannot exceed 250 characters",
    "any.required": "Reason why you reporting is required",
};
 

const reportSchema = Joi.object({
    productUrl: Joi.string().required().messages(productUrlMessages),
    reportGoodsType: Joi.string().required().messages(reportGoodsTypeMessages),
    reasonForReport: Joi.string().max(250).required().messages(reasonForReportMessages), 
    image: Joi.any().optional()
});



module.exports =  reportSchema;

