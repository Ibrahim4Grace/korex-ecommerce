'use strict';
const cloudinary = require('../configs/cloudinary');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const { updateAdminProfileMsg } = require('../mailer');
const { Blacklist, Product, Order, User, Merchant, Admin } = require('../models');


const {
  getTotalProducts,
  getTotalOrder,
  getTotalOrderAmount,
  sanitizeObject,
} = require('../utils');

const adminIndexPage = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;

  // Call the functions to get total products, total orders, and total order amount
  const totalProducts = await getTotalProducts();
  const totalOrders = await getTotalOrder();
  const totalOrderAmount = await getTotalOrderAmount();

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('admin/index', {
    admin,
    UserOrder: results,
    currentPage,
    totalPages,
    totalProducts,
    totalOrders,
    totalOrderAmount,
  });
});

const uploadAdminImage = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;

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
  admin.image = image;
  await admin.save();
  const callbackUrl = '/admin/index';
  return res.status(200).json({
    callbackUrl,
    success: true,
    message: 'Image uploaded successfully',
  });
});

const ProductsPage = (req, res, next) => {
  const admin = req.currentAdmin;

  const { results, currentPage, totalPages } = res.paginatedResults;
  res.render('admin/products', {
    admin,
    ourProducts: results,
    currentPage,
    totalPages,
  });
};

const viewProduct = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;
  const productInfo = await Product.findOne({ _id: req.params.productId });
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }
  res.status(200).json({ admin, success: true, productInfo });
});

const deleteProduct = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;
  const productInfo = await Product.findById(req.params.productId);
  if (!productInfo) {
    throw new APIError('Product information not found', 404);
  }

  await Product.findByIdAndDelete(req.params.productId);
  const redirectUrl = '/admin/products';

  res.status(201).json({
    redirectUrl,
    success: true,
    productInfo,
    admin,
    message: 'Product deleted successfully',
  });
});

const OrdersPage = tryCatch((req, res, next) => {
  const admin = req.currentAdmin;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('admin/orders', {
    admin,
    UserOrder: results,
    currentPage,
    totalPages,
  });
});

const viewOrderDetails = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;
  const orderNumber = req.params.orderNumber;

  const orders = await Order.find({ orderNumber }).populate('user');

  if (!orders || orders.length === 0) {
    throw new APIError('Order not found', 404);
  }

  res.status(200).json({ admin, orders, success: true });
});

const ourUsersPage = tryCatch((req, res, next) => {
  const admin = req.currentAdmin;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('admin/users', { admin, Users: results, currentPage, totalPages });
});

const ourMerchantsPage = tryCatch((req, res, next) => {
  const admin = req.currentAdmin;

  if (!res.paginatedResults) {
    throw new APIError('Paginated results not found', 404);
  }
  const { results, currentPage, totalPages } = res.paginatedResults;

  res.render('admin/merchants', {
    admin,
    merchants: results,
    currentPage,
    totalPages,
  });
});

const updateAccountStatus = tryCatch(async (req, res, next) => {
  const { userId, accountStatus, userType } = req.body;
  const validStatuses = ['Active', 'Suspend', 'Locked'];

  if (!validStatuses.includes(accountStatus)) {
    throw new APIError('Invalid account status', 400);
  }

  let model;
  if (userType === 'user') {
    model = User;
  } else if (userType === 'merchant') {
    model = Merchant;
  } else {
    throw new APIError('Invalid user type', 400);
  }

  const entity = await model.findById(userId);
  if (!entity) {
    throw new APIError('Entity not found', 404);
  }

  entity.accountStatus = accountStatus;
  await entity.save();

  res.status(200).json({ message: 'Account status updated successfully' });
});

const deleteUser = tryCatch(async (req, res, next) => {
  const { userId, userType } = req.body;

  let model;
  if (userType === 'user') {
    model = User;
  } else if (userType === 'merchant') {
    model = Merchant;
  } else {
    throw new APIError('Invalid user type', 400);
  }

  const deletedUser = await model.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new APIError('User not found', 404);
  }

  res.status(200).json({ message: 'User deleted successfully' });
});

const userMsgPage = tryCatch((req, res, next) => {
  const admin = req.currentAdmin;
  res.render('admin/chatWithUsers', { admin });
});

const adminSettings = (req, res, next) => {
  const admin = req.currentAdmin;
  res.render('admin/settings', { admin });
};

const editAdminProfile = tryCatch(async (req, res, next) => {
  const admin = req.currentAdmin;
  const {
    adminFirstName,
    adminLastName,
    adminEmail,
    adminUsername,
    adminAddress,
    adminCity,
    adminState,
    adminOldPassword,
    adminNewPassword,
  } = sanitizeObject(req.body);

  let hashedPassword = admin.adminPassword;
  if (adminOldPassword && adminNewPassword) {
    const passwordMatch = await bcrypt.compare(
      adminOldPassword,
      admin.adminPassword
    );
    if (!passwordMatch) {
      throw new APIError('Old password does not match', 400);
    }
    hashedPassword = await bcrypt.hash(adminNewPassword, 10);
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        adminFirstName,
        adminLastName,
        adminEmail,
        adminUsername,
        adminAddress,
        adminCity,
        adminState,
        adminPassword: hashedPassword,
      },
    },
    { new: true }
  );

  await updateAdminProfileMsg(updatedAdmin);
  res
    .status(201)
    .json({ admin, success: true, message: 'Profile updated successfully' });
});

const adminLogout = tryCatch(async (req, res, next) => {
  const adminAccessToken = req.cookies.adminAccessToken;
  const adminRefreshToken = req.cookies.adminRefreshToken;
  const logoutRedirectUrl = '/index';

  if (adminAccessToken || adminRefreshToken) {
    const newBlacklist = [
      { token: adminAccessToken },
      { token: adminRefreshToken },
    ];
    await Blacklist.insertMany(newBlacklist);
  }

  // Clear cookies
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.clearCookie('adminAccessToken');
  res.clearCookie('adminRefreshToken');

  res
    .status(200)
    .json({ logoutRedirectUrl, success: true, message: 'You are logged out!' });
  res.end();
});

module.exports = {
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
};
