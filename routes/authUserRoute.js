'use strict';
const express = require('express');
const router = express.Router();
const {
  verifyUserToken,
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
} = require('../middlewares');

const {
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
} = require('../controllers/authUserController');

// USER ROUTES

router.get(
  '/register',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  registerUser
);

router.post(
  '/registerUserPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  registerUserPost
);

// checkExistingUser route
router.get(
  '/checkExistingUser',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  checkExistingUser
);

// Email verification routes
router.get(
  '/emailVerification',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  verifyEmailPage
);
router.post(
  '/verifyEmailPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  verifyEmailPost
);

// Request New  verification link
router.get(
  '/requestVerification',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  requestVerification
);
router.post(
  '/requestVerificationPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  requestVerificationPost
);

//forgetPassword Routes
router.get(
  '/forgetPassword',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  forgetPassword
);
router.post(
  '/forgetPasswordPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  forgetPasswordPost
);

//ResettingPassword Routes
router.get(
  '/resetPassword/:resetToken',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  resetPassword
);
router.post(
  '/resetPasswordPost/:resetToken',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  resetPasswordPost
);

// User Login route with verifyAccessToken middleware
router.get(
  '/login',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  loginUser
);
router.post(
  '/userLoginPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  userLoginPost
);

router.post('/userRefreshToken', verifyUserToken, userRefreshToken);

//Google oAuth callback route
router.get(
  '/google',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  googleAuthController
);

router.get(
  '/google/callback',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  googleAuthCallback
);

module.exports = router;
