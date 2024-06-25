'use strict';
const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models');
const { verifyMerchantToken, getMerchantById } = require('../middlewares');
const { merchantImage, productImage } = require('../configs/multer');
const {
  paginatedResults,
  merchantOrdersFilter,
  merchantProductsFilter,
} = require('../utils');

const {
  welcomeMerchant,
  uploadMerchantImage,
  merchantProducts,
  merchantProductsPost,
  searchProduct,
  viewProduct,
  editProduct,
  editProductPost,
  deleteProduct,
  merchantOrders,
  updateOrderStatus,
  viewOrderDetails,
  merchantSettings,
  editProfilePage,
  logoutMerchant,
} = require('../controllers/merchantController');

router.get(
  '/index',
  verifyMerchantToken,
  getMerchantById,
  paginatedResults(Order, merchantOrdersFilter),
  welcomeMerchant
);
router.post(
  '/uploadMerchantImage',
  verifyMerchantToken,
  getMerchantById,
  merchantImage.single('image'),
  uploadMerchantImage
);

router.get(
  '/products',
  verifyMerchantToken,
  getMerchantById,
  paginatedResults(Product, merchantProductsFilter),
  merchantProducts
);
router.post(
  '/merchantProductsPost',
  verifyMerchantToken,
  getMerchantById,
  productImage.array('images[]'),
  merchantProductsPost
);

router.get(
  '/searchProduct',
  verifyMerchantToken,
  getMerchantById,
  searchProduct
);

router.get(
  '/viewProduct/:productId',
  verifyMerchantToken,
  getMerchantById,
  viewProduct
);

router.get(
  '/editProduct/:productId',
  verifyMerchantToken,
  getMerchantById,
  editProduct
);
router.put(
  '/editProductPost/:productId',
  verifyMerchantToken,
  getMerchantById,
  editProductPost
);
router.delete(
  '/deleteProduct/:productId',
  verifyMerchantToken,
  getMerchantById,
  deleteProduct
);

router.get(
  '/orders',
  verifyMerchantToken,
  getMerchantById,
  paginatedResults(Order, merchantOrdersFilter),
  merchantOrders
);
router.post(
  '/orders/updateOrdersStatus',
  verifyMerchantToken,
  getMerchantById,
  updateOrderStatus
);
router.get(
  '/orders/:orderNumber',
  verifyMerchantToken,
  getMerchantById,
  viewOrderDetails
);

router.get('/settings', verifyMerchantToken, getMerchantById, merchantSettings);
router.put(
  '/editProfilePage',
  verifyMerchantToken,
  getMerchantById,
  editProfilePage
);
router.delete(
  '/logoutMerchant',
  verifyMerchantToken,
  getMerchantById,
  logoutMerchant
);

module.exports = router;
