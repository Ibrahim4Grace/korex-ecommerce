'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomstring = require('randomstring');
const { Merchant } = require('../models');
const { merchantSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');
const { sanitizeInput, sanitizeObject } = require('../utils');
const {
  merchantRegistrationMsg,
  merchantVerifyEmailMsg,
  merchantRequestVerifyMsg,
  merchantForgetPswdMsg,
  merchantResetPswdMsg,
} = require('../mailer');

//Login attempts Limit
const MAX_FAILED_ATTEMPTS = config.maxFailedAttempt;

// Merchant Registration
const merchantRegisteration = (req, res) => {
  res.render('auth/merchant/merchantRegistration');
};

const merchantRegistrationPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = merchantSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  const verificationCode = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const merchantExists = await Merchant.findOne({
    $or: [
      { merchantEmail: value.merchantEmail },
      { merchantUsername: value.merchantUsername },
    ],
  });

  if (merchantExists) {
    if (merchantExists.merchantEmail === value.merchantEmail) {
      throw new APIError('Email already registered', 409);
    }
    if (merchantExists.merchantUsername === value.merchantUsername) {
      throw new APIError('Username already registered', 409);
    }
  }

  const hashedPassword = await bcrypt.hash(value.merchantPassword, 10);

  // Generate a unique verification token
  const verificationToken = {
    token: verificationCode,
    expires: new Date(Date.now() + 20 * 60 * 1000),
  };

  const {
    merchantFirstName,
    merchantLastName,
    merchantEmail,
    merchantPhone,
    merchantUsername,
    merchantAddress,
    merchantCity,
    merchantState,
    merchantCountry,
  } = value;

  const newMerchant = new Merchant({
    merchantFirstName,
    merchantLastName,
    merchantEmail,
    merchantPhone,
    merchantUsername,
    merchantAddress,
    merchantCity,
    merchantState,
    merchantCountry,
    merchantPassword: hashedPassword,
    role: 'Merchant',
    verificationToken: verificationToken,
    date_added: Date.now(),
  });

  await newMerchant.save();

  // Store merchant email in the session
  req.session.merchantEmail = merchantEmail;

  // After successfully registering the user, call the email sending function
  await merchantRegistrationMsg(newMerchant, verificationCode);

  res.status(201).json({
    success: true,
    message: 'Registeration successful please verify your email',
  });
});

const checkExistingMerchant = tryCatch(async (req, res) => {
  const { field, value } = req.query;
  let merchant;

  // Check if the field is either 'merchantEmail' or 'merchantUsername'
  if (field === 'merchantEmail' || field === 'merchantUsername') {
    const sanitizedField = sanitizeInput(field);
    const sanitizedValue = sanitizeInput(value);
    merchant = await Merchant.findOne({ [sanitizedField]: sanitizedValue });
  } else {
    throw new APIError('Invalid field parameter', 400);
  }

  if (merchant) {
    res.status(200).json({
      exists: true,
      message: `${field} has already been registered, please use it to log in.`,
    });
  } else {
    // If merchant doesn't exist, send a JSON response with exists: false
    res.json({ exists: false });
  }
});

const merchantVerifyEmail = tryCatch((req, res) => {
  const merchantEmail = req.session.merchantEmail;
  if (!merchantEmail) {
    throw new APIError('Merchant email not found', 400);
  }
  res.render('auth/merchant/merchantEmailVerification');
});

const merchantVerifyEmailPost = tryCatch(async (req, res) => {
  const { verificationCode } = req.body;
  const sanitizedVerificationCode = sanitizeInput(verificationCode);

  const merchantEmail = req.session.merchantEmail;
  if (!merchantEmail) {
    throw new APIError('User email not found', 401);
  }

  const merchant = await Merchant.findOne({ merchantEmail });
  if (!merchant) {
    throw new APIError('merchant not found', 404);
  }

  if (merchant.isVerified) {
    throw new APIError('Email has already been verified. Please log in.', 400);
  }

  if (
    !merchant.verificationToken ||
    merchant.verificationToken.token !== sanitizedVerificationCode
  ) {
    throw new APIError('Invalid verification code.', 400);
  }

  if (new Date() > merchant.verificationToken.expires) {
    throw new APIError('Verification code has expired.', 400);
  }

  await Merchant.findOneAndUpdate({ merchantEmail }, { isVerified: true });
  merchant.verificationToken = null;

  // Email content for verified user
  await merchantVerifyEmailMsg(merchant);

  return res
    .status(201)
    .json({ success: true, message: 'Email verified successfully.' });
});

const merchantRequestVerification = (req, res) => {
  res.render('auth/merchant/merchantrequestVerifyLink');
};

const merchantRequestVerificationPost = tryCatch(async (req, res) => {
  const merchantEmail = sanitizeInput(req.body.merchantEmail);
  const verificationCode = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  const merchant = await Merchant.findOne({ merchantEmail: merchantEmail });
  if (!merchant) {
    throw new APIError('No merchant found with this email', 400);
  }

  if (merchant.isVerified) {
    throw new APIError('Email is already verified.', 400);
  }

  // Generate a new verification token
  merchant.verificationToken = {
    token: verificationCode,
    expires: new Date(Date.now() + 30 * 60 * 1000),
  };

  await merchant.save();

  // Store user email in the session
  req.session.merchantEmail = merchantEmail;

  // Resend Email content to user
  await merchantRequestVerifyMsg(merchant, verificationCode);

  return res.status(200).json({
    success: true,
    message: 'Verification code resent. Please check your inbox.',
  });
});

const merchantForgetPassword = (req, res) => {
  const errorMessage = req.query.errorMessage;
  res.render('auth/merchant/merchantForgetPassword', { errorMessage });
};

const merchantForgetPasswordPost = tryCatch(async (req, res) => {
  const merchantEmail = sanitizeInput(req.body.merchantEmail);

  const merchant = await Merchant.findOne({ merchantEmail });
  if (!merchant) {
    throw new APIError('Merchant Email not found.', 404);
  }

  const resetToken = merchant.getResetPasswordTokens();
  await merchant.save();

  // Send the email with the reset link
  const resetLink = `${
    config.baseUrl || 'http://localhost:8080'
  }/auth/merchant/merchantResetPassword/${resetToken}`;

  // Send forget Email content to merchant Email
  await merchantForgetPswdMsg(merchant, resetLink);

  // Once email is sent successfully, respond with a 200 status and success message
  return res
    .status(200)
    .json({ success: true, message: 'Password reset link sent successfully' });
});

const merchantResetPassword = tryCatch(async (req, res) => {
  const { resetToken } = req.params;

  // Hash the reset token for comparison
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find the user with the provided reset token and check if it's still valid
  const merchant = await Merchant.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpires: { $gt: Date.now() }, // Token not expired
  });

  if (!merchant) {
    return res.redirect(
      '/auth/merchant/merchantForgetPassword?errorMessage=Invalid or expired reset token'
    );
  }

  res.render('auth/merchant/merchantResetPassword');
});

const merchantResetPasswordPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { merchantPassword, confirmMerchantPassword } = sanitizedBody;
  const { resetToken } = req.params;

  if (merchantPassword.length < 6) {
    throw new APIError('Minimum passwords must be 6 character.', 400);
  }

  if (merchantPassword !== confirmMerchantPassword) {
    throw new APIError('Passwords do not match.', 400);
  }

  // Hash the reset token for comparison
  const hashedRresetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find the user with the provided reset token and check if it's still valid
  const merchant = await Merchant.findOne({
    resetPasswordToken: hashedRresetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  const hashedPassword = bcrypt.hashSync(merchantPassword, 10);

  // If password matches, update the password to the new one
  merchant.merchantPassword = hashedPassword;
  merchant.resetPasswordToken = null;
  merchant.resetPasswordExpires = null;
  await merchant.save();

  // ResetPassword Email content to user
  await merchantResetPswdMsg(merchant);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully please login',
  });
});

const merchantLogin = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/merchant/merchantLogin', { authErrorMessage });
};

const merchantLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { merchantUsername, merchantPassword } = sanitizedBody;

  // Find the user by their username
  const merchant = await Merchant.findOne({ merchantUsername });
  if (!merchant) {
    throw new APIError('Invalid username provided', 401);
  }

  if (merchant.merchantRole !== 'Merchant') {
    throw new APIError('Access forbidden. Only merchants are allowed.', 403);
  }

  const passwordMatch = await bcrypt.compare(
    merchantPassword,
    merchant.merchantPassword
  );

  if (!passwordMatch) {
    // If passwords do not match, increment failed login attempts
    await Merchant.updateOne(
      { merchantUsername },
      { $inc: { failedLoginAttempts: 1 } }
    );

    // Check if the account should be locked
    const updatedMerchant = await Merchant.findOne({ merchantUsername });
    if (updatedMerchant.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      // Lock the account
      await Merchant.updateOne(
        { merchantUsername },
        { $set: { accountLocked: true } }
      );
      throw new APIError(
        'Account locked. Contact Korex for assistance or reset Password.',
        403
      );
    } else {
      throw new APIError(
        'Invalid Password 2 attenmpts left before access disabled.',
        409
      );
    }
  }

  if (!merchant.isVerified) {
    throw new APIError('Please verify your email before logging in.', 412);
  }

  if (
    merchant.accountLocked ||
    merchant.accountStatus === 'Suspend' ||
    merchant.accountStatus === 'Locked'
  ) {
    throw new APIError(
      'Your account is suspended or locked. Please contact the administrator for assistance.',
      423
    );
  }

  // Successful login - reset failed login attempts
  await Merchant.updateOne(
    { merchantUsername },
    { $set: { failedLoginAttempts: 0 } }
  );

  // Generate an access token and a refresh token
  const merchantAccessToken = jwt.sign(
    { id: merchant._id, merchantRole: merchant.merchantRole },
    config.jwtSecret,
    { expiresIn: config.merchantAccessTokenExpireTime }
  );
  const merchantRefreshToken = jwt.sign(
    { id: merchant._id, merchantRole: merchant.merchantRole },
    config.jwtSecret,
    { expiresIn: config.merchantRefreshTokenExpireTime }
  );

  req.session.merchantAccessToken = merchantAccessToken;
  req.session.merchantRefreshToken = merchantRefreshToken;

  // Set the tokens as cookies
  res.cookie('merchantAccessToken', merchantAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('merchantRefreshToken', merchantRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  const merchantRedirectUrl = '/merchant/index';
  res.status(200).json({
    merchantRedirectUrl,
    success: true,
    message: 'Merchant login successful',
  });
});

// refreshToken controller
const merchantRefreshToken = tryCatch((req, res) => {
  const merchantRefreshToken = req.cookies.merchantRefreshToken;
  if (!merchantRefreshToken) {
    throw new APIError('Merchant refresh token not provided', 401);
  }

  jwt.verify(
    merchantRefreshToken,
    config.jwtSecret,
    (err, decodedMerchantRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newMerchantAccessToken = jwt.sign(
          { id: decodedMerchantRefreshToken.id },
          config.jwtSecret,
          { expiresIn: config.merchantAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info(
          'New access token generated for merchant:',
          newMerchantAccessToken
        );

        res.cookie('merchantAccessToken', newMerchantAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res
          .status(200)
          .json({ merchantAccessToken: newMerchantAccessToken });
      }
    }
  );
});

module.exports = {
  merchantRegisteration,
  merchantRegistrationPost,
  checkExistingMerchant,
  merchantVerifyEmail,
  merchantVerifyEmailPost,
  merchantRequestVerification,
  merchantRequestVerificationPost,
  merchantForgetPassword,
  merchantForgetPasswordPost,
  merchantResetPassword,
  merchantResetPasswordPost,
  merchantLogin,
  merchantLoginPost,
  merchantRefreshToken,
};
