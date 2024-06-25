const { OAuth2Client } = require('google-auth-library');
const customEnv = require('../configs/customEnvVariables');
const dotenv = require('dotenv');

dotenv.config();

const googleClient = new OAuth2Client(
  customEnv.googleClientId,
  customEnv.googleClientSecret,
  customEnv.googleOauthRedirectUrl
);

module.exports = googleClient;
