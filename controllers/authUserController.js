'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const randomstring = require('randomstring');
const passport = require('../configs/passportAuth');
const { User, Google } = require('../models');
const { userSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');
const customEnv = require('../configs/customEnvVariables');
const googleClient = require('../configs/googleAuth');
const {
  sanitizeInput,
  sanitizeObject,
  generateAndSetTokens,
} = require('../utils');
const {
  sendVerificationEmail,
  verifyEmailMsg,
  requestVerificationMsg,
  forgetPasswordMsg,
  resetPasswordMsg,
} = require('../mailer');

//Login attempts Limit
const MAX_FAILED_ATTEMPTS = customEnv.maxFailedAttempt;

// User Registration attempt
const registerUser = (req, res) => {
  res.render('auth/user/register');
};

const registerUserPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = userSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  const verificationCode = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  // If validation fails, return the error details
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const user = await User.findOne({
    $or: [{ userEmail: value.userEmail }, { userUsername: value.userUsername }],
  });

  if (user) {
    if (user.userEmail === value.userEmail) {
      throw new APIError('Email already registered', 409);
    }
    if (user.userUsername === value.userUsername) {
      throw new APIError('Username already registered', 409);
    }
  }

  const {
    userFirstName,
    userLastName,
    userEmail,
    userUsername,
    userAddress,
    userCity,
    userState,
    userCountry,
    userDob,
    userNumber,
    userPassword,
  } = value;

  // Step 2 - Generate a verification token with the user's ID
  const verificationToken = {
    token: verificationCode,
    expires: new Date(Date.now() + 20 * 60 * 1000),
  };

  // If validation passes and user does not exist, proceed with registration
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  // Save the user data to the database
  const newUser = new User({
    userFirstName,
    userLastName,
    userEmail,
    userUsername,
    userAddress,
    userCity,
    userState,
    userCountry,
    userDob,
    userNumber,
    userPassword: hashedPassword,
    verificationToken: verificationToken,
    date_added: Date.now(),
  });

  await newUser.save();

  // Store user email in the session
  req.session.userEmail = userEmail;

  // After successfully registering the user, call the email sending function
  await sendVerificationEmail(newUser, verificationCode);

  res.status(201).json({
    success: true,
    message: 'Registeration successful. Check your email for verification code',
  });
});

//async email and user validating
const checkExistingUser = tryCatch(async (req, res) => {
  const { field, value } = req.query;
  let user;

  if (field === 'userEmail' || field === 'userUsername') {
    const sanitizedField = sanitizeInput(field);
    const sanitizedValue = sanitizeInput(value);
    user = await User.findOne({ [sanitizedField]: sanitizedValue });
  } else {
    throw new APIError('Invalid field parameter', 400);
  }

  if (user) {
    res.status(200).json({
      exists: true,
      message: `${field} has already been registered, please log in.`,
    });
  } else {
    // If user doesn't exist, send a JSON response with exists: false
    res.json({ exists: false });
  }
});

const verifyEmailPage = tryCatch((req, res) => {
  const userEmail = req.session.userEmail;
  if (!userEmail) {
    throw new APIError('User email not found', 400);
  }
  res.render('auth/user/emailVerification');
});

const verifyEmailPost = tryCatch(async (req, res) => {
  const { verificationCode } = req.body;
  const sanitizedVerificationCode = sanitizeInput(verificationCode);

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    throw new APIError('User email not found', 401);
  }

  const user = await User.findOne({ userEmail });
  if (!user) {
    throw new APIError('User not found', 404);
  }

  if (user.isVerified) {
    throw new APIError('Email has already been verified. Please log in.', 400);
  }

  if (
    !user.verificationToken ||
    user.verificationToken.token !== sanitizedVerificationCode // Use the sanitized value here
  ) {
    throw new APIError('Invalid verification code.', 400);
  }

  if (new Date() > user.verificationToken.expires) {
    throw new APIError('Verification code has expired.', 400);
  }

  await User.findOneAndUpdate({ userEmail }, { isVerified: true });
  user.verificationToken = null;

  // Email content for verified user
  await verifyEmailMsg(user);

  return res
    .status(201)
    .json({ success: true, message: 'Email verified successfully.' });
});

//Request new verification  link
const requestVerification = (req, res) => {
  res.render('auth/user/requestVerification');
};

const requestVerificationPost = tryCatch(async (req, res) => {
  const userEmail = sanitizeInput(req.body.userEmail);
  const verificationCode = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  const user = await User.findOne({ userEmail });
  if (!user) {
    throw new APIError('No user found with this email', 400);
  }

  if (user.isVerified) {
    throw new APIError('Email is already verified.', 400);
  }

  // Generate a new verification token
  user.verificationToken = {
    token: verificationCode,
    expires: new Date(Date.now() + 30 * 60 * 1000),
  };

  await user.save();

  // Store user email in the session
  req.session.userEmail = userEmail;

  // Resend Email content to user
  await requestVerificationMsg(user, verificationCode);

  return res.status(200).json({
    success: true,
    message: 'Verification code resent. Please check your inbox.',
  });
});

// Forget Password
const forgetPassword = (req, res) => {
  const errorMessage = req.query.errorMessage;
  res.render('auth/user/forgetPassword', { errorMessage });
};

const forgetPasswordPost = tryCatch(async (req, res) => {
  const userEmail = sanitizeInput(req.body.userEmail);

  const user = await User.findOne({ userEmail });
  if (!user) {
    throw new APIError('Email not found', 404);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Send the email with the reset link
  const resetLink = `${
    customEnv.baseUrl || 'http://localhost:8080'
  }/auth/user/resetPassword/${resetToken}`;

  // Send forget Email content to user
  await forgetPasswordMsg(user, resetLink);

  return res.status(200).json({
    success: true,
    message: 'Reset link sent to your mail successfully',
  });
});

//  RESET PASSWORD SECTION
const resetPassword = tryCatch(async (req, res) => {
  const { resetToken } = req.params;

  // Hash the reset token for comparison
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find the user with the provided reset token and check if it's still valid
  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpires: { $gt: Date.now() }, // Token not expired
  });

  // Check if the user exists
  if (!user) {
    // If the token is not found or has expired, redirect to expired password page
    return res.redirect(
      '/auth/user/forgetPassword?errorMessage=Invalid or expired reset token'
    );
  }

  res.render('auth/user/resetPassword');
});

const resetPasswordPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { userPassword, confirmPassword } = sanitizedBody;
  const { resetToken } = req.params;

  if (userPassword.length < 6) {
    throw new APIError('Minimum passwords must be 6 character', 400);
  }

  if (userPassword !== confirmPassword) {
    throw new APIError('Passwords do not match', 400);
  }

  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find the user with the provided reset token and check if it's still valid
  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  const hashedPassword = bcrypt.hashSync(userPassword, 10);

  // If password matches, update the password to the new one
  user.userPassword = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // ResetPassword Email content to user
  await resetPasswordMsg(user);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully please login',
  });
});

// User login
const loginUser = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/user/login', { authErrorMessage });
};

const userLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { userUsername, userPassword } = sanitizedBody;

  const user = await User.findOne({ userUsername });

  if (!user) {
    throw new APIError('Invalid username provided', 401);
  }

  if (user.userRole !== 'User') {
    throw new APIError('Access forbidden. Only user are allowed', 403);
  }

  const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  if (!passwordMatch) {
    // If passwords do not match, increment failed login attempts
    await User.updateOne(
      { userUsername },
      { $inc: { failedLoginAttempts: 1 } }
    );

    // Check if the account should be locked
    const updatedUser = await User.findOne({ userUsername });
    if (updatedUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      await User.updateOne({ userUsername }, { $set: { accountLocked: true } });
      throw new APIError(
        'Account locked. Contact Korex for assistance or reset Password',
        403
      );
    } else {
      throw new APIError(
        'Invalid Password 2 attempts left before access disabled',
        409
      );
    }
  }

  // Check if user is verified and account is not locked
  if (!user.isVerified) {
    throw new APIError('Please verify your email before log in.', 412);
  }

  if (
    user.accountLocked ||
    user.accountStatus === 'Suspend' ||
    user.accountStatus === 'Locked'
  ) {
    throw new APIError(
      'Your account is suspended or locked. Please contact the administrator for assistance.',
      423
    );
  }

  // Successful login - reset failed login attempts
  await User.updateOne({ userUsername }, { $set: { failedLoginAttempts: 0 } });

  // Generate an access token and a refresh token
  const userAccessToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    customEnv.jwtSecret,
    { expiresIn: customEnv.userAccessTokenExpireTime }
  );
  const userRefreshToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    customEnv.jwtSecret,
    { expiresIn: customEnv.userRefreshTokenExpireTime }
  );

  req.session.userAccessToken = userAccessToken;
  req.session.userRefreshToken = userRefreshToken;

  // Set the tokens as cookies
  res.cookie('userAccessToken', userAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('userRefreshToken', userRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  // Check if the user has items in the cart // Determine the redirect URL based on whether the user has items in the cart
  const cart = req.session.cart || [];
  const hasItemsInCart = cart.length > 0;
  const userAuthRedirectUrl = hasItemsInCart
    ? '/user/shoppingcart'
    : '/user/index';
  req.session.userAuthRedirectUrl = userAuthRedirectUrl;

  res.status(200).json({
    userAuthRedirectUrl,
    success: true,
    message: 'User login successful',
  });
});

// refreshToken controller
const userRefreshToken = tryCatch((req, res) => {
  const userRefreshToken = req.cookies.userRefreshToken;

  if (!userRefreshToken) {
    return res.status(401).json({ message: 'User refresh token not provided' });
  }

  jwt.verify(
    userRefreshToken,
    customEnv.jwtSecret,
    (err, decodedUserRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newUserAccessToken = jwt.sign(
          { id: decodedUserRefreshToken.id },
          customEnv.jwtSecret,
          { expiresIn: customEnv.userAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info('New access token generated for user:', newUserAccessToken);

        res.cookie('userAccessToken', newUserAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ userAccessToken: newUserAccessToken });
      }
    }
  );
});

//Google Auth sign in
const googleAuthController = tryCatch((req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

const googleAuthCallback = tryCatch(async (req, res) => {
  const { code } = req.query;
  if (!code) {
    throw new APIError('No code in query', 400);
  }

  const { tokens } = await googleClient.getToken({
    code,
    redirect_uri: process.env.GOOGLE_0AUTH_REDIRECTURL,
  });

  googleClient.setCredentials(tokens);

  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  let user = await Google.findOne({ email: payload.email });

  if (!user) {
    user = new Google({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
      isVerified: true,
    });

    await user.save();
  }

  const { userAccessToken, userRefreshToken } = generateAndSetTokens(
    res,
    user._id
  );

  res.status(200).json({
    userAccessToken,
    userRefreshToken,
    success: true,
    message: 'Google OAuth login successful',
    user: user,
  });
});

module.exports = {
  registerUser,
  registerUserPost,
  checkExistingUser,
  verifyEmailPage,
  verifyEmailPost,
  requestVerification,
  requestVerificationPost,
  forgetPassword,
  forgetPasswordPost,
  resetPassword,
  resetPasswordPost,
  loginUser,
  userLoginPost,
  userRefreshToken,
  googleAuthController,
  googleAuthCallback,
};
