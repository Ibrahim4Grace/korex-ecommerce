const {
  getTotalProducts,
  getTotalOrder,
  getTotalOrderAmount,
} = require('./productCount');

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
  merchantOrdersFilter,
  merchantProductsFilter,
} = require('./pagination');

const {
  cartCalculation,
  generateOrderNumber,
  formatToTwoDecimal,
} = require('./cartCalculation');

const { sanitizeInput, sanitizeObject } = require('./inputSanitizer');

const generateAndSetTokens = require('./userToken');

module.exports = {
  getTotalProducts,
  getTotalOrder,
  getTotalOrderAmount,

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
  merchantOrdersFilter,
  merchantProductsFilter,
  cartCalculation,
  generateOrderNumber,
  formatToTwoDecimal,

  sanitizeInput,
  sanitizeObject,

  generateAndSetTokens,
};
