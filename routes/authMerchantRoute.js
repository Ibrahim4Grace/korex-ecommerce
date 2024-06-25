'use strict';
const express = require('express');
const router = express.Router();
const {
  isUserSignedIn,
  verifyMerchantToken,
  isMerchantSignedIn,
  isAdminSignedIn,
} = require('../middlewares');

const {
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
} = require('../controllers/authMerchantController');

// Merchant Registeration route
router.get(
  '/merchantRegistration',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantRegisteration
);
router.post(
  '/merchantRegistrationPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantRegistrationPost
);

// checkExistingMerchant route
router.get(
  '/checkExistingMerchant',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  checkExistingMerchant
);

// Merchant Email verification routes
router.get(
  '/merchantEmailVerification',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantVerifyEmail
);
router.post(
  '/merchantverifyEmailPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantVerifyEmailPost
);

// Merchant Request New  verification link
router.get(
  '/merchantrequestVerifyLink',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantRequestVerification
);
router.post(
  '/merchantRequestVerificationPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantRequestVerificationPost
);

//Merchant forgetPassword Routes
router.get(
  '/merchantForgetPassword',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantForgetPassword
);
router.post(
  '/merchantForgetPasswordPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantForgetPasswordPost
);

//Merchant ResettingPassword Routes
router.get(
  '/merchantResetPassword/:resetToken',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantResetPassword
);
router.post(
  '/merchantResetPasswordPost/:resetToken',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantResetPasswordPost
);

// Merchant Login route
router.get(
  '/merchantLogin',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantLogin
);
router.post(
  '/merchantLoginPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  merchantLoginPost
);

router.post('/merchantRefreshToken', verifyMerchantToken, merchantRefreshToken);

module.exports = router;
