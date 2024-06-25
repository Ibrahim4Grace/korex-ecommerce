'use strict';
const express = require('express');
const router = express.Router();
const { Product } = require('../models');

const { isUserSignedIn, isMerchantSignedIn } = require('../middlewares');

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
} = require('../utils');

const {
  spinner,
  indexPage,
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
  contactPage,
  contactPagePost,
  addToCartPage,
  shoppingcartPage,
  updateQuantity,
  removeFromCart,
  productDetailsPage,
} = require('../controllers/landingPageController');

router.get('/', isUserSignedIn, isMerchantSignedIn, spinner);
router.get(
  '/index',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product),
  indexPage
);
router.get(
  '/productInfo/:productId',
  isUserSignedIn,
  isMerchantSignedIn,
  productInfo
);
router.get(
  '/checkExistingNewLetterUser',
  isUserSignedIn,
  isMerchantSignedIn,
  checkExistingNewLetterUser
);
router.post(
  '/newsLetterSubcriber',
  isUserSignedIn,
  isMerchantSignedIn,
  newsLetterSubcriber
);
router.get(
  '/shop',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product),
  shopPage
);

router.get(
  '/menDress',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, menDressFilter),
  menDresstPage
);
router.get(
  '/womenDress',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, womenDressFilter),
  womenDressesPage
);
router.get(
  '/babyDress',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, babyDressFilter),
  babyDressesPage
);
router.get(
  '/jeans',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, JeansFilter),
  jeansPage
);
router.get(
  '/blazers',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, BlazersFilter),
  blazersPage
);
router.get(
  '/jackets',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, JacketsFilter),
  jacketsPage
);
router.get(
  '/swimwear',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, SwimwearsFilter),
  swimwearPage
);
router.get(
  '/sleepwear',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, SleepwearsFilter),
  sleepwearPage
);
router.get(
  '/sportswear',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, SportswearsFilter),
  sportswearPage
);
router.get(
  '/jumpsuits',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, JumpsuitsFilter),
  jumpsuitsPage
);
router.get(
  '/loafers',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, loafersFilter),
  loafersPage
);
router.get(
  '/sneakers',
  isUserSignedIn,
  isMerchantSignedIn,
  paginatedResults(Product, SneakersFilter),
  sneakersPage
);

router.get('/contact', isUserSignedIn, isMerchantSignedIn, contactPage);
router.post(
  '/contactPagePost',
  isUserSignedIn,
  isMerchantSignedIn,
  contactPagePost
);
router.post(
  '/addToCartPage/:productId',
  isUserSignedIn,
  isMerchantSignedIn,
  addToCartPage
);
router.get(
  '/shoppingcart',
  isUserSignedIn,
  isMerchantSignedIn,
  shoppingcartPage
);
router.post(
  '/updateQuantity',
  isUserSignedIn,
  isMerchantSignedIn,
  updateQuantity
);
router.post(
  '/removeFromCart',
  isUserSignedIn,
  isMerchantSignedIn,
  removeFromCart
);
router.get(
  '/productDetails',
  isUserSignedIn,
  isMerchantSignedIn,
  productDetailsPage
);

module.exports = router;
