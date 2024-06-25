const Joi = require('joi');

const reviewRatingMessages = {
    "number.empty": "Rating is required",
    "number.min": "Rating must be greater than or equal to 1",
    "number.max": "Rating must be less than or equal to 5",
    "any.required": "Rating is required",
};

const reviewMessageMessages = {
    "string.empty": "Message is required",
    "string.max": "Message cannot exceed 250 characters",
    "any.required": "Message is required",
};


// Define a Joi schema for the review data
const productReviewSchema = Joi.object({
    reviewRating: Joi.number().min(1).max(5).required().messages(reviewRatingMessages),
    reviewMessage: Joi.string().max(250).required().messages(reviewMessageMessages), 
});

module.exports =  productReviewSchema;

