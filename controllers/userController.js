'use strict';
const config = require('../configs/customEnvVariables');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const cloudinary = require('../configs/cloudinary');
const paystack = require('paystack-api')(config.paystackSecret);
const {
  Product,
  Order,
  NewsLetter,
  User,
  Blacklist,
  ReportSeller,
} = require('../models');

const {
  newsLetterSchema,
  productReviewSchema,
  reportSchema,
} = require('../validations');
const {
  updateProfileMsg,
  purchaseConfirmationMsg,
  reportSellerMsg,
  newNewsLetterMsg,
} = require('../mailer');
const {
  cartCalculation,
  generateOrderNumber,
  formatToTwoDecimal,
  sanitizeInput,
  sanitizeObject,
} = require('../utils');

const userLandingPage = tryCatch(async (req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  let { results, currentPage, totalPages } = res.paginatedResults;

  // Randomly shuffle the array of products
  results = results.sort(() => Math.random() - 0.5);

  // Limiting the number of products to 8
  const slicedResults = results.slice(0, 8);

  // If slicedResults contains less than 8 products, fetch additional products
  if (slicedResults.length < 8) {
    const additionalResultsCount = 8 - slicedResults.length;
    const additionalProducts = await Product.find({})
      .limit(additionalResultsCount)
      .exec();
    slicedResults.push(...additionalProducts);
  }

  // Fetch the latest products based on the date_added field from your Product model.
  const latestProducts = await Product.find({})
    .sort({ date_added: -1 })
    .limit(8)
    .exec();

  // Fetch random products excluding the current product
  const randomProducts = await Product.aggregate([
    { $sample: { size: 5 } }, // Get a random sample of 5 products
  ]);

  res.render('user/index', {
    user,
    latestProducts,
    randomProducts,
    trendProducts: slicedResults,
    currentPage,
    totalPages,
  });
});

//Merchant viewing product details
const productInfo = tryCatch(async (req, res) => {
  const user = req.currentUser;

  const productInfo = await Product.findOne({ _id: req.params.productId });
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }

  // Assuming colors are stored as an array in the
  res
    .status(201)
    .json({ user, success: true, productInfo: productInfo.toObject() });
});

//checkExistingNewLetterUser
const checkExistingNewLetterUser = tryCatch(async (req, res, next) => {
  try {
    const sanitizedField = sanitizeInput(req.query.field);
    const sanitizedValue = sanitizeInput(req.query.value);
    let user;

    // Only allow 'subscriberEmail' as a valid field
    if (sanitizedField !== 'subscriberEmail') {
      throw new APIError('Invalid field parameter', 400);
    }

    user = await NewsLetter.findOne({ [sanitizedField]: sanitizedValue });

    if (user) {
      res.status(200).json({
        exists: true,
        message: `${sanitizedField} has already subscribed.`,
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    next(error);
  }
});

//Add  newsLetterSubcriber
const newsLetterSubcriber = tryCatch(async (req, res) => {
  const user = req.currentUser;

  // Sanitize the input data before validation
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = newsLetterSchema.validate(sanitizedBody);

  // If validation fails, return the error details
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const { subscriberEmail } = value;
  const newNewsLetter = new NewsLetter({
    subscriberEmail,
    date_added: Date.now(),
  });
  await newNewsLetter.save();

  // Call the email sending function to send message to the sender
  await newNewsLetterMsg(newNewsLetter);

  res
    .status(201)
    .json({ user, success: true, message: 'Newsletter successfully joined' });
});

const shopPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('user/shop', {
    user,
    ourProducts: results,
    currentPage,
    totalPages,
  });
});

const menDresstPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/menDress', {
    user,
    menProducts: results,
    currentPage,
    totalPages,
  });
});

const womenDressesPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/womenDress', {
    user,
    womenProducts: results,
    currentPage,
    totalPages,
  });
});

const babyDressesPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/babyDress', {
    user,
    babyProducts: results,
    currentPage,
    totalPages,
  });
});

const jeansPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/jeans', {
    user,
    jeanProducts: results,
    currentPage,
    totalPages,
  });
});

const blazersPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/blazers', {
    user,
    blazerProducts: results,
    currentPage,
    totalPages,
  });
});

const jacketsPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/jackets', {
    user,
    jackProducts: results,
    currentPage,
    totalPages,
  });
});

const swimwearPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/swimwear', {
    user,
    swimProducts: results,
    currentPage,
    totalPages,
  });
});

const sleepwearPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/sleepwear', {
    user,
    sleepProducts: results,
    currentPage,
    totalPages,
  });
});

const sportswearPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/sportswear', {
    user,
    sportProducts: results,
    currentPage,
    totalPages,
  });
});

const jumpsuitsPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/jumpsuits', {
    user,
    jumpProducts: results,
    currentPage,
    totalPages,
  });
});

const loafersPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/loafers', {
    user,
    loaferProducts: results,
    currentPage,
    totalPages,
  });
});

const sneakersPage = tryCatch((req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/sneakers', {
    user,
    sneakProducts: results,
    currentPage,
    totalPages,
  });
});

const productReviewMsg = tryCatch(async (req, res) => {
  const user = req.currentUser;

  // Validate request body against the schema
  const { error, value } = productReviewSchema.validate(req.body, {
    abortEarly: false,
  });

  // If validation fails, return the error details
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.context.key,
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  // If validation passes, proceed with the logic
  const { reviewRating, reviewMessage } = value;
  const productId = req.params.productId;

  // Retrieve the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    throw new APIError('Product not found', 404);
  }

  // Fetch the user document
  const reviewUser = await User.findById(user._id);
  if (!reviewUser) {
    throw new APIError('Review user not found', 404);
  }

  // Push the review to the product's reviews array
  product.reviews.push({
    productId: productId,
    reviewRating: reviewRating,
    reviewMessage: reviewMessage,
    userFirstName: reviewUser.userFirstName,
    userLastName: reviewUser.userLastName,
  });

  // Save the updated product
  await product.save();

  res.status(201).json({ success: true, data: product });
});

const productDetailsPage = tryCatch(async (req, res) => {
  const user = req.currentUser;

  const productId = req.query.productId;
  const product = await Product.findById(productId);

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  // Fetch random products excluding the current product
  const randomProducts = await Product.aggregate([
    { $match: { _id: { $ne: product._id } } }, // Exclude the current product
    { $sample: { size: 5 } },
  ]);

  res.render('user/productDetails', { user, product, randomProducts });
});

const addToCartPage = tryCatch(async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const selectedColor = req.body.selectedColor;
    const selectedSize = req.body.selectedSize;
    const quantity = req.body.quantity;

    const product = await Product.findById(productId);
    if (!product) {
      throw new APIError('Product not found', 404);
    }

    let cart = req.session.cart || [];

    // Check if the product is already in the cart
    const isProductInCart = cart.some(
      (item) => item._id.toString() === productId
    );

    if (isProductInCart) {
      // If the product is already in the cart, check if the selected color and size match
      const isMatchingColorAndSize = cart.some(
        (item) =>
          item._id.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize &&
          item.quantity === quantity
      );

      if (isMatchingColorAndSize) {
        throw new APIError('Item is already in the cart', 400);
      } else {
        // If color and size don't match, update the item's color and size
        cart.forEach((item) => {
          if (item._id.toString() === productId) {
            item.selectedColor = selectedColor;
            item.selectedSize = selectedSize;
            item.quantity = quantity;
          }
        });
      }
    } else {
      // If the product is not in the cart, add it with the selected color and size
      cart.push({
        ...product.toObject(),
        quantity,
        selectedColor,
        selectedSize,
      });
    }

    // Update the cart stored in the session
    req.session.cart = cart;

    res
      .status(201)
      .json({ success: true, message: 'Product successfully added to cart' });
  } catch (error) {
    next(error);
  }
});

const shoppingcartPage = tryCatch((req, res) => {
  const user = req.currentUser;

  // Store the current URL (shopping cart page URL) in the session
  req.session.redirectUrl = req.originalUrl;

  // Retrieve the cart stored in the session
  const cart = req.session.cart || [];
  const productTotalAmount = req.session.productTotalAmount || 0;

  const { subtotal, totalShipping, totalAmount } = cartCalculation(cart);

  // Update cart items to include out of stock status
  const updatedCart = cart.map((product) => {
    return {
      ...product,
      isOutOfStock: product.productQuantity === 0,
    };
  });

  res.render('user/shoppingcart', {
    user,
    cartItems: updatedCart,
    subtotal,
    totalShipping,
    totalAmount,
    productTotalAmount,
  });
});

const updateQuantity = tryCatch(async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    let cart = req.session.cart || [];

    // Find the product in the cart
    const productIndex = cart.findIndex(
      (item) => item._id.toString() === productId
    );

    if (productIndex !== -1) {
      const product = await Product.findById(productId);
      if (!product) {
        throw new APIError('Product not found.', 404);
      }

      if (quantity > product.productQuantity) {
        throw new APIError(
          'The chosen quantity exceeds the available quantity.',
          400
        );
      }

      if (quantity < 1) {
        throw new APIError('Quantity must be at least 1.', 400);
      }

      // Calculate product total amount
      const productTotalAmount = quantity * parseFloat(product.productPrice);

      // Update the quantity and productTotalAmount in the cart
      cart[productIndex].quantity = quantity;
      cart[productIndex].productTotalAmount = productTotalAmount;

      // Update the cart stored in the session
      req.session.cart = cart;
      req.session.productTotalAmount = productTotalAmount; // Update productTotalAmount in session

      // Calculate subtotal, total shipping, and total amount for the entire cart
      const { subtotal, totalShipping, totalAmount } = cartCalculation(cart);

      // Return updated data to the frontend
      res.json({
        cart,
        productTotalAmount,
        totalAmount,
        subtotal,
        totalShipping,
      });
    } else {
      throw new APIError('Product not found in cart', 404);
    }
  } catch (error) {
    next(error);
  }
});

const removeFromCart = tryCatch((req, res) => {
  const user = req.currentUser;

  const productId = req.body.productId;

  // Retrieve the cart stored in the session
  let cart = req.session.cart || [];

  // Filter out the item with the specified productId from the cart
  cart = cart.filter((item) => item._id.toString() !== productId);

  // Update the cart stored in the session
  req.session.cart = cart;

  // Calculate subtotal, total shipping, and total amount for the entire cart
  const { subtotal, totalShipping, totalAmount } = cartCalculation(cart);

  // Save the updated cart data to the session
  req.session.save(() => {
    // console.log('Cart updated:', req.session.cart);
    res.status(200).json({
      user,
      totalAmount,
      subtotal,
      totalShipping,
      success: true,
      message: 'Item removed from cart',
    });
  });
});

const proceedToCheckout = tryCatch((req, res) => {
  const user = req.currentUser;

  // Retrieve cart information from the session
  const cart = req.session.cart || [];
  const productTotalAmount = req.session.productTotalAmount || 0;

  // Calculate subtotal, total shipping, and total amount for the entire cart
  const { subtotal, totalShipping, totalAmount } = cartCalculation(cart);

  res.render('user/checkout', {
    user,
    cartItems: cart,
    subtotal,
    totalShipping,
    totalAmount,
    productTotalAmount,
  });
});

const initializeTrans = tryCatch(async (req, res) => {
  const user = req.currentUser;

  let { id } = req.params;
  const { email, amount } = req.body;

  const callbackUrl = `${
    config.baseUrl || 'http://localhost:8080'
  }/user/checkout`;

  const response = await paystack.transaction.initialize({
    email,
    amount,
    callback_url: callbackUrl,
  });

  const data = {
    paystack_ref: response.data.reference,
    totalAmount: amount,
  };
  await User.findByIdAndUpdate(id, data);

  res.status(200).json({
    user,
    data: response.data,
    message: response.message,
    status: response.status,
  });
});

const verifyTrans = tryCatch(async (req, res) => {
  const user = req.currentUser;

  let { id } = req.params;
  if (!id) {
    throw new APIError('Invalid user ID', 400);
  }

  // If the transaction has already been verified, return a success response
  if (user.paystack_ref === 'success') {
    return res.status(401).send({
      data: {},
      message: 'Transaction has already been verified',
      status: 1,
    });
  }

  const response = await paystack.transaction.verify({
    reference: user.paystack_ref,
  });

  const data = {
    paystack_ref: response.data.reference,
    totalAmount: response.data.amount,
    paymentStatus: response.data.status,
  };
  await User.findByIdAndUpdate(id, data);

  // Return a success response if the payment is verified
  if (response.data.status === 'success') {
    return res.status(200).send({
      data: response.data,
      message: 'Transaction verified successfully',
      status: 1,
    });
  } else {
    // If the payment verification fails, update the user document and return an error response
    const failedMessage =
      response.data.gateway_response || 'Payment verification failed';
    await User.findByIdAndUpdate(id, { paymentStatus: failedMessage });

    return res
      .status(200)
      .send({ data: response.data, message: failedMessage, status: 0 });
  }
});

const submitOrder = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const { shippingAddress, cartItems, subtotal, totalShipping, totalAmount } =
    req.body;

  // Map cartItems to adjust the structure and include merchantId
  const formattedCartItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await Product.findById(item.productID).populate(
        'merchantId'
      );
      return {
        productName: item.productName,
        productPrice: item.productPrice,
        productImages: item.productImages,
        productQuantity: item.productQuantity,
        productColor: item.productColor,
        productSize: item.productSize,
        productID: item.productID,
        merchantId: product.merchantId._id,
      };
    })
  );

  // Format subtotal, totalShipping, and totalAmount using the helper function
  const orderNumber = await generateOrderNumber();
  const formattedSubtotal = formatToTwoDecimal(subtotal);
  const formattedTotalShipping = formatToTwoDecimal(totalShipping);
  const formattedTotalAmount = formatToTwoDecimal(totalAmount);

  // Check if an order with the same payment reference already exists
  const existingOrder = await Order.findOne({
    paystack_ref: user.paystack_ref,
  });
  if (existingOrder) {
    throw new APIError('Duplicate order submission', 400);
  }

  const orderDetails = {
    shippingAddress,
    cartItems: formattedCartItems,
    subtotal: formattedSubtotal,
    totalShipping: formattedTotalShipping,
    totalAmount: formattedTotalAmount,
    orderNumber,
    paystack_ref: user.paystack_ref,
    paymentStatus: user.paymentStatus,
    date_added: new Date(),
  };

  const order = new Order({
    user: req.user.id,
    ...orderDetails,
  });
  await order.save();

  // Send purchase confirmation to user
  await purchaseConfirmationMsg(user, orderDetails);

  // Clear shopping cart session after successful order submission
  req.session.cart = [];

  // Update product quantities in the database
  for (const item of formattedCartItems) {
    const product = await Product.findById(item.productID);
    if (product) {
      product.productQuantity -= item.productQuantity;
      if (product.productQuantity <= 0) {
        product.productQuantity = 0;
        product.status = 'Out of Stock';
      }
      await product.save();
    }
  }

  const username = `${user.userFirstName} ${user.userLastName}`;
  req.session.orderInfo = { username, totalAmount, orderNumber };

  const successPageUrl = '/successPage';
  res.status(201).json({
    successPageUrl,
    success: true,
    message: 'Order submmited successfully',
  });
});

const successPage = tryCatch((req, res) => {
  const user = req.currentUser;

  const { username, totalAmount, orderNumber } = req.session.orderInfo;
  const paystackRef = user.paystack_ref;
  delete req.session.orderInfo;

  res.render('user/successPage', {
    user,
    username,
    totalAmount,
    orderNumber,
    paystackRef,
  });
});

const profilePage = tryCatch(async (req, res) => {
  const user = req.currentUser;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('user/myaccount', { user, results, currentPage, totalPages });
});

const editProfilePage = tryCatch(async (req, res) => {
  const user = req.currentUser;

  // Sanitize each input field
  const sanitizedUserFirstName = sanitizeInput(req.body.userFirstName);
  const sanitizedUserLastName = sanitizeInput(req.body.userLastName);
  const sanitizedUserEmail = sanitizeInput(req.body.userEmail);
  const sanitizedUserUsername = sanitizeInput(req.body.userUsername);
  const sanitizedUserNumber = sanitizeInput(req.body.userNumber);
  const sanitizedUserDob = sanitizeInput(req.body.userDob);
  const sanitizedUserAddress = sanitizeInput(req.body.userAddress);
  const sanitizedUserCity = sanitizeInput(req.body.userCity);
  const sanitizedUserState = sanitizeInput(req.body.userState);
  const sanitizedUserCountry = sanitizeInput(req.body.userCountry);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        userFirstName: sanitizedUserFirstName,
        userLastName: sanitizedUserLastName,
        userEmail: sanitizedUserEmail,
        userUsername: sanitizedUserUsername,
        userNumber: sanitizedUserNumber,
        userDob: sanitizedUserDob,
        userAddress: sanitizedUserAddress,
        userCity: sanitizedUserCity,
        userState: sanitizedUserState,
        userCountry: sanitizedUserCountry,
      },
    },
    { new: true }
  );

  // update product Email content to merchant
  await updateProfileMsg(updatedUser);

  res.status(201).json({
    user,
    success: true,
    message: 'Information successfully updated',
  });
});

const uploadUserImage = tryCatch(async (req, res) => {
  const user = req.currentUser;
  // Handle the uploaded file
  const file = req.file;

  if (!file) {
    throw new APIError('No file uploaded', 400);
  }

  // Upload image to Cloudinary
  const cloudinaryResult = await cloudinary.uploader.upload(file.path);

  // Create an image object for saving in the database
  const image = {
    imageId: cloudinaryResult.public_id,
    imageUrl: cloudinaryResult.secure_url,
  };

  user.image = image;
  await user.save();

  const callbackUrl = '/user/myaccount';
  return res.status(200).json({
    callbackUrl,
    success: true,
    message: 'Image uploaded successfully',
  });
});

const getOrderDetails = tryCatch(async (req, res) => {
  const user = req.currentUser;
  const orderNumber = req.params.orderNumber;

  const orders = await Order.find({ orderNumber }).populate('user');

  if (!orders || orders.length === 0) {
    throw new APIError('Order not found', 404);
  }

  res.status(200).json({ user, orders, success: true });
});

const reportSeller = tryCatch(async (req, res) => {
  const user = req.currentUser;

  const sanitizedBody = {
    productUrl: sanitizeInput(req.body.productUrl),
    reportGoodsType: sanitizeInput(req.body.reportGoodsType),
    reasonForReport: sanitizeInput(req.body.reasonForReport),
  };

  const { error, value } = reportSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  let image = null;
  if (req.file) {
    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    image = {
      imageId: cloudinaryResult.public_id,
      imageUrl: cloudinaryResult.secure_url,
    };
  }

  const { productUrl, reportGoodsType, reasonForReport } = value;
  const newReportSeller = new ReportSeller({
    productUrl,
    reportGoodsType,
    reasonForReport,
    image: image,
  });
  await newReportSeller.save();

  // Call the email sending function to send message to the buyer
  await reportSellerMsg(user, newReportSeller);

  res.status(201).json({ success: true, message: 'Report successfully sent' });
});

const logoutUser = tryCatch(async (req, res) => {
  const userAccessToken = req.cookies.userAccessToken;
  const userRefreshToken = req.cookies.userRefreshToken;
  const logoutRedirectUrl = '/index';

  if (userAccessToken || userRefreshToken) {
    // Blacklist both access and refresh tokens
    const newBlacklist = [
      { token: userAccessToken },
      { token: userRefreshToken },
    ];
    await Blacklist.insertMany(newBlacklist);
  }

  // Clear cookies
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.clearCookie('userAccessToken');
  res.clearCookie('userRefreshToken');

  res
    .status(200)
    .json({ logoutRedirectUrl, success: true, message: 'You are logged out!' });
  res.end(); // End the response
});

module.exports = {
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
};
