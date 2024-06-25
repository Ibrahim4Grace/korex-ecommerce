const Joi = require('joi');
const emailMessages = {
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format. Please provide a valid email address.',
    'any.required': 'Email is required',
};



// Define a Joi schema for the newsLetter data
const newsLetterSchema = Joi.object({
    subscriberEmail: Joi.string().email({
        minDomainSegments: 2, // Ensures that the domain has at least 2 segments (e.g., example.com)
        tlds: { 
            allow: ['com', 'net'] 
        } // Allows top-level domains (e.g., .com, .net)
    }).required().messages(emailMessages),
});


 module.exports =  newsLetterSchema
