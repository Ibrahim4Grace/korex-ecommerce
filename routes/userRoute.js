'use strict';
const express = require('express');
const router = express.Router();
const { verifyUserToken, getUserById } = require('../middlewares');
const { Product, Order } = require('../models');

const { userImage, reportImage } = require('../configs/multer');

const {
  paginatedResults,
  menDressFilter,
  womenDressFilter,
  babyDressFilter,
  JeansFilter,
  BlazersFilter,
  JacketsFilter,
  SwimwearsFilter,
  SleepwearsFilter,
  SportswearsFilter,
  JumpsuitsFilter,
  loafersFilter,
  SneakersFilter,
  userOrdersFilter,
} = require('../utils');

const {
  userLandingPage,
  productInfo,
  checkExistingNewLetterUser,
  newsLetterSubcriber,
  shopPage,
  menDresstPage,
  womenDressesPage,
  babyDressesPage,
  jeansPage,
  blazersPage,
  jacketsPage,
  swimwearPage,
  sleepwearPage,
  sportswearPage,
  jumpsuitsPage,
  loafersPage,
  sneakersPage,
  productReviewMsg,
  productDetailsPage,
  addToCartPage,
  shoppingcartPage,
  updateQuantity,
  removeFromCart,
  proceedToCheckout,
  initializeTrans,
  verifyTrans,
  submitOrder,
  successPage,
  profilePage,
  editProfilePage,
  uploadUserImage,
  getOrderDetails,
  reportSeller,
  logoutUser,
} = require('../controllers/userController');

router.get(
  '/index',
  verifyUserToken,
  getUserById,
  paginatedResults(Product),
  userLandingPage
);
router.get(
  '/user/productInfo/:productId',
  verifyUserToken,
  getUserById,
  productInfo
);
router.get(
  '/checkExistingNewLetterUser',
  verifyUserToken,
  getUserById,
  checkExistingNewLetterUser
);
router.post(
  '/newsLetterSubcriber',
  verifyUserToken,
  getUserById,
  newsLetterSubcriber
);
router.get(
  '/shop',
  verifyUserToken,
  getUserById,
  paginatedResults(Product),
  shopPage
);
router.get(
  '/menDress',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, menDressFilter),
  menDresstPage
);
router.get(
  '/womenDress',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, womenDressFilter),
  womenDressesPage
);
router.get(
  '/babyDress',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, babyDressFilter),
  babyDressesPage
);
router.get(
  '/jeans',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, JeansFilter),
  jeansPage
);
router.get(
  '/blazers',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, BlazersFilter),
  blazersPage
);
router.get(
  '/jackets',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, JacketsFilter),
  jacketsPage
);
router.get(
  '/swimwear',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, SwimwearsFilter),
  swimwearPage
);
router.get(
  '/sleepwear',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, SleepwearsFilter),
  sleepwearPage
);
router.get(
  '/sportswear',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, SportswearsFilter),
  sportswearPage
);
router.get(
  '/jumpsuits',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, JumpsuitsFilter),
  jumpsuitsPage
);
router.get(
  '/loafers',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, loafersFilter),
  loafersPage
);
router.get(
  '/sneakers',
  verifyUserToken,
  getUserById,
  paginatedResults(Product, SneakersFilter),
  sneakersPage
);

router.post(
  '/productReviewMsg/:productId',
  verifyUserToken,
  getUserById,
  productReviewMsg
);
router.get('/productDetails', verifyUserToken, getUserById, productDetailsPage);
router.post(
  '/addToCartPage/:productId',
  verifyUserToken,
  getUserById,
  addToCartPage
);
router.get('/shoppingcart', verifyUserToken, getUserById, shoppingcartPage);
router.post('/updateQuantity', verifyUserToken, getUserById, updateQuantity);
router.post('/removeFromCart', verifyUserToken, getUserById, removeFromCart);
router.get('/checkout', verifyUserToken, getUserById, proceedToCheckout);
router.post(
  '/initializeTrans/:id',
  verifyUserToken,
  getUserById,
  initializeTrans
);
router.post(
  '/verifyTransaction/:id',
  verifyUserToken,
  getUserById,
  verifyTrans
);
router.post('/submitOrder', verifyUserToken, getUserById, submitOrder);
router.get('/successPage', verifyUserToken, getUserById, successPage);

router.get(
  '/myaccount',
  verifyUserToken,
  getUserById,
  paginatedResults(Order, userOrdersFilter),
  profilePage
);
router.put('/editProfilePage', verifyUserToken, getUserById, editProfilePage);
router.post(
  '/uploadUserImage',
  verifyUserToken,
  getUserById,
  userImage.single('image'),
  uploadUserImage
);
router.get(
  '/orders/:orderNumber',
  verifyUserToken,
  getUserById,
  getOrderDetails
);
router.post(
  '/reportSeller',
  verifyUserToken,
  getUserById,
  reportImage.single('image'),
  reportSeller
);

router.delete('/logoutUser', verifyUserToken, getUserById, logoutUser);

module.exports = router;
