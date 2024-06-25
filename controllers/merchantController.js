const cloudinary = require('../configs/cloudinary');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { Product, Blacklist, Order, Merchant } = require('../models');
const bcrypt = require('bcryptjs');
const { productSchema } = require('../validations');
const {
  getTotalProducts,
  getTotalOrder,
  getTotalOrderAmount,
  sanitizeInput,
  sanitizeObject,
} = require('../utils');
const {
  productRegistrationMsg,
  productUpdateMsg,
  updateMerchantProfileMsg,
} = require('../mailer');

//Merchant Landing page
const welcomeMerchant = tryCatch(async (req, res) => {
  const merchant = req.currentMerchant;

  // Call the functions to get total products, total orders, and total order amount
  const totalProducts = await getTotalProducts(merchant._id);
  const totalOrders = await getTotalOrder(merchant._id);
  const totalOrderAmount = await getTotalOrderAmount(merchant._id);

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('merchant/index', {
    merchant,
    UserOrder: results,
    currentPage,
    totalPages,
    totalProducts,
    totalOrders,
    totalOrderAmount,
  });
});

const uploadMerchantImage = tryCatch(async (req, res) => {
  const merchant = req.currentMerchant;

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

  merchant.image = image;
  await merchant.save();

  const callbackUrl = '/merchant/index';
  return res.status(200).json({
    callbackUrl,
    success: true,
    message: 'Image uploaded successfully',
  });
});

//   PRODUCT SECTION
const merchantProducts = (req, res, next) => {
  const merchant = req.currentMerchant;

  // Accessing properties directly from res.paginatedResults
  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('merchant/products', {
    merchant,
    ourProducts: results,
    currentPage,
    totalPages,
  });
};

const merchantProductsPost = tryCatch(async (req, res) => {
  const merchant = req.currentMerchant;

  if (!req.files || req.files.length === 0) {
    throw new APIError('No images uploaded', 400);
  }

  // Upload images to Cloudinary and get their IDs
  const cloudinaryUploads = req.files.map((file) =>
    cloudinary.uploader.upload(file.path)
  );

  // Wait for all uploads to finish
  const cloudinaryResults = await Promise.all(cloudinaryUploads);

  // Map Cloudinary results to image objects for saving in the database
  const images = cloudinaryResults.map((result) => ({
    imageId: result.public_id,
    imageUrl: result.secure_url,
  }));

  // Sanitize the input data before validation
  const sanitizedBody = {
    productName: sanitizeInput(req.body.productName),
    productDescription: sanitizeInput(req.body.productDescription),
    productPrice: sanitizeInput(req.body.productPrice),
    productShipping: sanitizeInput(req.body.productShipping),
    productCategory: sanitizeInput(req.body.productCategory),
    productBrand: sanitizeInput(req.body.productBrand),
    productSize: sanitizeInput(req.body.productSize),
    productColor: sanitizeInput(req.body.productColor),
    productQuantity: sanitizeInput(req.body.productQuantity),
    productGender: sanitizeInput(req.body.productGender),
  };

  const { error, value } = productSchema.validate(sanitizedBody);
  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const {
    productName,
    productDescription,
    productPrice,
    productShipping,
    productCategory,
    productBrand,
    productSize,
    productColor,
    productQuantity,
    productGender,
  } = value;

  const newProduct = new Product({
    productName,
    productDescription,
    productPrice,
    productShipping,
    productCategory,
    productBrand,
    productSize,
    productColor,
    productQuantity,
    productGender,
    images: images,
    merchantId: merchant._id,
    reviews: [],
    date_added: Date.now(),
  });
  await newProduct.save();

  // After successfully product registering the merchant, call the email sending function
  await productRegistrationMsg(newProduct, merchant);
  const redirectUrl = '/merchant/products';
  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'Product successfully registered',
  });
});

//Merchant search product
const searchProduct = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;

  // Sanitize the input data
  const productName = sanitizeInput(req.query.productName);
  // Use a regular expression to perform a case-insensitive search for the product name
  const products = await Product.find({
    productName: { $regex: productName, $options: 'i' },
  });

  res.status(201).json({ merchant, success: true, products });
});

//Merchant viewing product details
const viewProduct = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;
  const productInfo = await Product.findOne({ _id: req.params.productId });
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }
  res.status(200).json({ success: true, productInfo, merchant });
});

//Merchant edit product details
const editProduct = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;

  const editProduct = await Product.findById({ _id: req.params.productId });
  if (!editProduct) {
    throw new APIError('Product information not found', 404);
  }

  res.status(201).json({ success: true, editProduct, merchant });
});

const editProductPost = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;

  // Sanitize each input field
  const sanitizedproductName = sanitizeInput(req.body.productName);
  const sanitizedproductDescription = sanitizeInput(
    req.body.productDescription
  );
  const sanitizedproductPrice = sanitizeInput(req.body.productPrice);
  const sanitizedproductOldPrice = sanitizeInput(req.body.productOldPrice);
  const sanitizedproductShipping = sanitizeInput(req.body.productShipping);
  const sanitizedproductCategory = sanitizeInput(req.body.productCategory);
  const sanitizedproductBrand = sanitizeInput(req.body.productBrand);
  const sanitizedproductSize = sanitizeInput(req.body.productSize);
  const sanitizedproductColor = sanitizeInput(req.body.productColor);
  const sanitizedproductQuantity = sanitizeInput(req.body.productQuantity);

  const productId = req.params.productId;
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productName: sanitizedproductName,
        productDescription: sanitizedproductDescription,
        productPrice: sanitizedproductPrice,
        productOldPrice: sanitizedproductOldPrice,
        productShipping: sanitizedproductShipping,
        productCategory: sanitizedproductCategory,
        productBrand: sanitizedproductBrand,
        productSize: sanitizedproductSize,
        productColor: sanitizedproductColor,
        productQuantity: sanitizedproductQuantity,
        merchantId: merchant._id,
      },
    },
    { new: true }
  );

  const redirectUrl = '/merchant/products';

  // Update product email content to merchant
  await productUpdateMsg(updatedProduct, merchant);

  res.status(201).json({
    redirectUrl,
    success: true,
    message: 'Product successfully updated',
  });
});

//Merchant delete product
const deleteProduct = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;
  const productInfo = await Product.findById(req.params.productId);
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }

  await Product.findByIdAndDelete(req.params.productId);
  const redirectUrl = '/merchant/products';

  res.status(201).json({
    redirectUrl,
    success: true,
    productInfo,
    merchant,
    message: 'Product deleted successfully',
  });
});

const merchantOrders = tryCatch((req, res, next) => {
  const merchant = req.currentMerchant;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('merchant/orders', {
    merchant,
    UserOrder: results,
    currentPage,
    totalPages,
  });
});

const updateOrderStatus = tryCatch(async (req, res, next) => {
  const { orderId, shipmentStatus } = req.body;
  const validStatuses = ['Shipped', 'Processing', 'Complete', 'Cancelled'];

  if (!validStatuses.includes(shipmentStatus)) {
    throw new APIError('Invalid shipment status', 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new APIError('Order not found', 404);
  }

  order.shipmentStatus = shipmentStatus;
  await order.save();

  res.status(200).json({ message: 'Shipment status updated successfully' });
});

const viewOrderDetails = tryCatch(async (req, res, next) => {
  const merchant = req.currentMerchant;
  const orderNumber = req.params.orderNumber;

  const orders = await Order.find({ orderNumber }).populate('user');

  if (!orders || orders.length === 0) {
    throw new APIError('Order not found', 404);
  }

  res.status(200).json({ merchant, orders, success: true });
});

const merchantSettings = (req, res, next) => {
  const merchant = req.currentMerchant;
  res.render('merchant/settings', { merchant });
};

const editProfilePage = tryCatch(async (req, res, next) => {
  try {
    const merchant = req.currentMerchant;

    const sanitizedBody = sanitizeObject(req.body);

    // Destructure sanitized fields
    const {
      merchantFirstName,
      merchantLastName,
      merchantEmail,
      merchantPhone,
      merchantUsername,
      merchantAddress,
      merchantCity,
      merchantState,
      merchantCountry,
      merchantOldPassword,
      merchantNewPassword,
    } = sanitizedBody;

    // Handle password update if both old and new passwords are provided
    let hashedPassword = merchant.merchantPassword;
    if (merchantOldPassword && merchantNewPassword) {
      const passwordMatch = await bcrypt.compare(
        merchantOldPassword,
        merchant.merchantPassword
      );
      if (!passwordMatch) {
        throw new APIError('Old password does not match', 400);
      }
      hashedPassword = await bcrypt.hash(merchantNewPassword, 10);
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          merchantFirstName,
          merchantLastName,
          merchantEmail,
          merchantPhone,
          merchantUsername,
          merchantAddress,
          merchantCity,
          merchantState,
          merchantCountry,
          merchantPassword: hashedPassword,
        },
      },
      { new: true }
    );

    // Send email update notification
    await updateMerchantProfileMsg(updatedMerchant);

    res.status(201).json({
      merchant: updatedMerchant,
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

const logoutMerchant = tryCatch(async (req, res, next) => {
  const merchantAccessToken = req.cookies.merchantAccessToken;
  const merchantRefreshToken = req.cookies.merchantRefreshToken;
  const logoutRedirectUrl = '/index';

  if (merchantAccessToken || merchantRefreshToken) {
    // Blacklist both access and refresh tokens
    const newBlacklist = [
      { token: merchantAccessToken },
      { token: merchantRefreshToken },
    ];
    await Blacklist.insertMany(newBlacklist);
  }

  // Clear cookies
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.clearCookie('merchantAccessToken');
  res.clearCookie('merchantRefreshToken');

  res
    .status(200)
    .json({ logoutRedirectUrl, success: true, message: 'You are logged out!' });
  res.end(); // End the response
});

module.exports = {
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
};
