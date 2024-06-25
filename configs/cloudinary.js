const config = require('./customEnvVariables');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinaryCloudName, 
    api_key: config.cloudinaryApiName,      
    api_secret: config.cloudinarySecretName,     
});

module.exports = cloudinary;

