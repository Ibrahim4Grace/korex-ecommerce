'use strict';
const express = require('express');
const router = express.Router();
const { verifyAdminToken, getAdminById } = require('../middlewares');
const { Merchant, Product, Order, User } = require('../models');
const { adminImage } = require('../configs/multer');
const { paginatedResults } = require('../utils');

const {
  adminIndexPage,
  uploadAdminImage,
  ProductsPage,
  userMsgPage,
  viewProduct,
  deleteProduct,
  OrdersPage,
  viewOrderDetails,
  ourUsersPage,
  ourMerchantsPage,
  updateAccountStatus,
  deleteUser,
  adminSettings,
  editAdminProfile,
  adminLogout,
} = require('../controllers/adminController');

router.get(
  '/index',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Order),
  adminIndexPage
);
router.post(
  '/uploadAdminImage',
  verifyAdminToken,
  getAdminById,
  adminImage.single('image'),
  uploadAdminImage
);
router.get('/chatWithUsers', verifyAdminToken, getAdminById, userMsgPage);

router.get(
  '/products',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Product),
  ProductsPage
);
router.get(
  '/viewProduct/:productId',
  verifyAdminToken,
  getAdminById,
  viewProduct
);
router.delete(
  '/deleteProduct/:productId',
  verifyAdminToken,
  getAdminById,
  deleteProduct
);

router.get(
  '/orders',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Order),
  OrdersPage
);
router.get(
  '/orders/:orderNumber',
  verifyAdminToken,
  getAdminById,
  viewOrderDetails
);

router.get(
  '/users',
  verifyAdminToken,
  getAdminById,
  paginatedResults(User),
  ourUsersPage
);
router.post(
  '/users/updateAccountStatus',
  verifyAdminToken,
  getAdminById,
  updateAccountStatus
);
router.get(
  '/merchants',
  verifyAdminToken,
  getAdminById,
  paginatedResults(Merchant),
  ourMerchantsPage
);
router.post(
  '/merchants/updateAccountStatus',
  verifyAdminToken,
  getAdminById,
  updateAccountStatus
);
router.delete(
  '/deleteProduct/:userId',
  verifyAdminToken,
  getAdminById,
  deleteUser
);

router.get('/settings', verifyAdminToken, getAdminById, adminSettings);
router.put(
  '/editAdminProfile',
  verifyAdminToken,
  getAdminById,
  editAdminProfile
);

router.delete('/adminLogout', verifyAdminToken, getAdminById, adminLogout);

module.exports = router;
