'use strict';
const express = require('express');
const router = express.Router();
const {
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  verifyAdminToken,
} = require('../middlewares');

const {
  registerAdmin,
  registerAdminPost,
  adminLogin,
  adminLoginPost,
  adminRefreshToken,
} = require('../controllers/authAdminController');

router.get(
  '/registerAdmin',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  registerAdmin
);
router.post(
  '/registerAdminPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  registerAdminPost
);

router.get(
  '/login',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  adminLogin
);
router.post(
  '/adminLoginPost',
  isUserSignedIn,
  isMerchantSignedIn,
  isAdminSignedIn,
  adminLoginPost
);
router.post('/adminRefreshToken', verifyAdminToken, adminRefreshToken);

module.exports = router;
