const Joi = require('joi');

const firstNameMessages = {
    "string.empty": "Firstname is required",
    "string.min": "Firstname must be at least {#limit} characters",
    "any.required": "Firstname is required",
};
const lastNameMessages = {
    "string.empty": "Lastname is required",
    "string.min": "Lastname must be at least {#limit} characters",
    "any.required": "Lastname is required",
};
const emailMessages = {
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format. Please provide a valid email address.',
    'any.required': 'Email is required',
};
const usernameMessages = {
    "string.empty": "Username is required",
    "string.min": "Username must be at least {#limit} characters",
    "any.required": "Username is required",
};
const addressMessages = {
    "string.empty": "Address is required",
    "string.min": "Address must be at least {#limit} characters",
    "any.required": "Address is required",
};
const cityMessages = {
    "string.empty": "City is required",
    "string.min": "City must be at least {#limit} characters",
    "any.required": "City is required",
};
const stateMessages = {
    "string.empty": "State is required",
    "string.min": "State must be at least {#limit} characters",
    "any.required": "State is required",
};
const countryMessages = {
    "string.empty": "State is required",
    "any.required": "State is required",
};
const dobMessages = {
    "string.empty": "Dob is required",
    "any.required": "Dob is required",
};
const numberMessages = {
    "string.empty": "Phone number is required",
    'string.pattern.base': 'Phone number must contain only digits',
    "string.min": "Phone number must be at least {#limit} characters",
    "any.required": "Phone number is required",
};
const passwordMessages = {
    "string.empty": "Password is required",
    "string.min": "Password must be at least {#limit} characters",
    "any.required": "Password is required",
};
const ConfirmPasswordMessages = {
    "any.only": "Passwords must match",
    "string.empty": "Confirm password is required",
    "any.required": "Password is required",
    
};

// Define a Joi schema for the user data
const userSchema = Joi.object({
    userFirstName: Joi.string().min(2).required().messages(firstNameMessages),
    userLastName: Joi.string().min(2).required().messages(lastNameMessages),
    userEmail: Joi.string().email({
        minDomainSegments: 2, // Ensures that the domain has at least 2 segments (e.g., example.com)
        tlds: { 
            allow: ['com', 'net'] 
        }
    }).required().messages(emailMessages),
    userUsername: Joi.string().min(5).required().messages(usernameMessages),
    userAddress: Joi.string().min(5).required().messages(addressMessages),
    userCity: Joi.string().min(2).required().messages(cityMessages),
    userState: Joi.string().min(2).required().messages(stateMessages),
    userCountry: Joi.string().required().messages(countryMessages),
    userDob: Joi.date().required().messages(dobMessages), 
    userNumber: Joi.string().pattern(/^\d+$/).min(5).required().messages(numberMessages), 
    userPassword: Joi.string().min(6).required().messages(passwordMessages),
    confirmPassword: Joi.string().valid(Joi.ref('userPassword')).required().messages(ConfirmPasswordMessages),
});


 module.exports =  userSchema
