const Joi = require('joi');

const contactUsNameMessages = {
    "string.empty": "Your name is required",
    "any.required": "Your name is required",
};
const contactUsEmailMessages = {
    "string.empty": "Your email is required",
    "string.email": "Contact email must be a valid email address",
    "any.required": "Your email is required",
};
const contactUsSubjectMessages = {
    "string.empty": "Subject is required",
    "any.required": "Subject brand name is required",
};
const contactUsMsgMessages = {
    "string.empty": "Message is required",
    "string.max": "Message cannot exceed 250 characters",
    "any.required": "Message is required",
};


// Define a Joi schema for the contact data
const contactUsSchema = Joi.object({
    contactUsName: Joi.string().required().messages(contactUsNameMessages),
    contactUsEmail: Joi.string().email({
        minDomainSegments: 2, // Ensures that the domain has at least 2 segments (e.g., example.com)
        tlds: { 
            allow: ['com', 'net'] 
        }
    }).required().messages(contactUsEmailMessages),
    contactUsSubject: Joi.string().required().messages(contactUsSubjectMessages),
    contactUsMsg: Joi.string().max(250).required().messages(contactUsMsgMessages),  
   
});


module.exports =  contactUsSchema;

