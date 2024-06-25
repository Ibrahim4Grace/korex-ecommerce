const { ContactUs, Product, NewsLetter } = require('../models');
const { newsLetterSchema, contactUsSchema } = require('../validations');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { contactQueriesMsg, newNewsLetterMsg } = require('../mailer');
const { cartCalculation } = require('../utils/cartCalculation');
const { sanitizeInput, sanitizeObject } = require('../utils');

const spinner = (req, res) => {
  res.render('spinner');
};

const indexPage = tryCatch(async (req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  let { results, currentPage, totalPages } = res.paginatedResults;

  results = results.sort(() => Math.random() - 0.5);

  const slicedResults = results.slice(0, 8);

  // If slicedResults contains less than 8 products, fetch additional products this happen due to my pagination limit
  if (slicedResults.length < 8) {
    const additionalResultsCount = 8 - slicedResults.length;
    const additionalProducts = await Product.find({}).limit(
      additionalResultsCount
    );
    slicedResults.push(...additionalProducts); //... aad 3 products to the array
  }

  const latestProducts = await Product.find({})
    .sort({ date_added: -1 })
    .limit(8);

  // Fetch random products excluding the current product
  const randomProducts = await Product.aggregate([
    { $sample: { size: 5 } }, // Get a random sample of 5 products
  ]);

  res.render('index', {
    latestProducts,
    randomProducts,
    trendProducts: slicedResults,
    currentPage,
    totalPages,
  });
});

//Merchant viewing product details
const productInfo = tryCatch(async (req, res) => {
  const productInfo = await Product.findOne({ _id: req.params.productId });
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }

  // Assuming colors are stored as an array in the
  res.status(201).json({ success: true, productInfo: productInfo.toObject() });
});

//checkExistingNewLetterUser
const checkExistingNewLetterUser = tryCatch(async (req, res) => {
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
});

//Add  newsLetterSubcriber
const newsLetterSubcriber = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = newsLetterSchema.validate(sanitizedBody);
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
    .json({ success: true, message: 'Newsletter successfully Joined' });
});

const shopPage = tryCatch(async (req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('shop', { ourProducts: results, currentPage, totalPages });
});

const menDresstPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('menDress', { menProducts: results, currentPage, totalPages });
});

const womenDressesPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('womenDress', { womenProducts: results, currentPage, totalPages });
});

const babyDressesPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('babyDress', { babyProducts: results, currentPage, totalPages });
});

const jeansPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('jeans', { jeanProducts: results, currentPage, totalPages });
});

const blazersPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('blazers', { blazerProducts: results, currentPage, totalPages });
});

const jacketsPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('jackets', { jackProducts: results, currentPage, totalPages });
});

const swimwearPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('swimwear', { swimProducts: results, currentPage, totalPages });
});

const sleepwearPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('sleepwear', { sleepProducts: results, currentPage, totalPages });
});

const sportswearPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('sportswear', { sportProducts: results, currentPage, totalPages });
});

const jumpsuitsPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('jumpsuits', { jumpProducts: results, currentPage, totalPages });
});

const loafersPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('loafers', { loaferProducts: results, currentPage, totalPages });
});

const sneakersPage = tryCatch((req, res) => {
  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('sneakers', { sneakProducts: results, currentPage, totalPages });
});

const contactPage = (req, res) => {
  res.render('contact');
};

const contactPagePost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);

  const { error, value } = contactUsSchema.validate(sanitizedBody, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    // console.error('Joi validation error:', errors);
    return res.status(400).json({ success: false, errors });
  }

  const { contactUsName, contactUsEmail, contactUsSubject, contactUsMsg } =
    value;
  const newContactUs = new ContactUs({
    contactUsName,
    contactUsEmail,
    contactUsSubject,
    contactUsMsg,
    date_added: Date.now(),
  });
  await newContactUs.save();

  // Call the email sending function to send message to the sender
  await contactQueriesMsg(newContactUs);

  // console.log('Message successfully sent:', newContactUs);
  res.status(201).json({ success: true, message: 'Message successfully sent' });
});

const addToCartPage = tryCatch(async (req, res) => {
  const productId = req.body.productId;
  const selectedColor = req.body.selectedColor;
  const selectedSize = req.body.selectedSize;

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
        item.selectedSize === selectedSize
    );

    if (isMatchingColorAndSize) {
      throw new APIError('Item is already in the cart', 400);
    } else {
      // If color and size don't match, update the item's color and size
      cart.forEach((item) => {
        if (item._id.toString() === productId) {
          item.selectedColor = selectedColor;
          item.selectedSize = selectedSize;
        }
      });
    }
  } else {
    // If the product is not in the cart, add it with the selected color and size
    cart.push({
      ...product.toObject(),
      quantity: 1,
      selectedColor,
      selectedSize,
    });
  }

  // Update the cart stored in the session
  req.session.cart = cart;

  res
    .status(201)
    .json({ success: true, message: 'Product successfully added to cart' });
});

const shoppingcartPage = tryCatch((req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  // Retrieve the cart stored in the session
  const cart = req.session.cart || [];
  const productTotalAmount = req.session.productTotalAmount || 0;

  const { subtotal, totalShipping, totalAmount } = cartCalculation(cart);

  res.render('shoppingcart', {
    cartItems: cart,
    subtotal,
    totalShipping,
    totalAmount,
    productTotalAmount,
    authErrorMessage,
  });
});

const updateQuantity = tryCatch(async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = req.session.cart || [];

  // Find the product in the cart
  const productIndex = cart.findIndex(
    (item) => item._id.toString() === productId
  );

  if (productIndex !== -1) {
    // Check if the product quantity exceeds the available quantity in the database
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
    cart[productIndex].quantity = quantity;
    cart[productIndex].productTotalAmount = productTotalAmount;

    // Update the cart stored in the session
    req.session.cart = cart;

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
});

const removeFromCart = tryCatch((req, res) => {
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
      totalAmount,
      subtotal,
      totalShipping,
      success: true,
      message: 'Item removed from cart',
    });
  });
});

const productDetailsPage = tryCatch(async (req, res) => {
  const productId = req.query.productId;

  const product = await Product.findById(productId);

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  // Fetch random products excluding the current product
  // we're using MongoDB's aggregation pipeline to exclude the current product ($ne: product._id)
  const randomProducts = await Product.aggregate([
    { $match: { _id: { $ne: product._id } } }, // Exclude the current product
    { $sample: { size: 5 } }, // Get a random sample of 5 products
  ]);

  res.render('productDetails', { product, randomProducts });
});

module.exports = {
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
};
