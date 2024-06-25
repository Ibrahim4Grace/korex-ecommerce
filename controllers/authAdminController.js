const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { tryCatch } = require('../middlewares');
const APIError = require('../errorHandlers/apiError');
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');
const { adminRegistrationMsg } = require('../mailer');
const { sanitizeObject } = require('../utils');

const registerAdmin = (req, res) => {
  res.render('auth/admin/registerAdmin');
};

const registerAdminPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { error, value } = merchantSchema.validate(sanitizedBody, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      key: err.path[0],
      msg: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  const adminExists = await Admin.findOne({
    $or: [
      { adminEmail: value.adminEmail },
      { adminUsername: value.adminUsername },
    ],
  });

  if (adminExists) {
    const errors = [];
    if (adminExists.adminEmail === value.adminEmail) {
      errors.push({ key: 'adminEmail', msg: 'Email already registered' });
    }
    if (adminExists.adminUsername === value.adminUsername) {
      errors.push({ key: 'adminUsername', msg: 'Username already registered' });
    }
    return res.status(409).json({ success: false, errors });
  }

  const hashedPassword = await bcrypt.hash(value.adminPassword, 10);

  const {
    adminFirstName,
    adminLastName,
    adminEmail,
    adminUsername,
    adminAddress,
    adminCity,
    adminState,
  } = value;

  const newAdmin = new Admin({
    adminFirstName,
    adminLastName,
    adminEmail,
    adminUsername,
    adminAddress,
    adminCity,
    adminState,
    adminPassword: hashedPassword,
    date_added: Date.now(),
  });

  await newAdmin.save();
  await adminRegistrationMsg(newAdmin);

  const redirectUrl = `/auth/admin/login`;

  res
    .status(201)
    .json({ redirectUrl, success: true, message: 'Registeration successful' });
});

const adminLogin = (req, res) => {
  const authErrorMessage = req.session.authErrorMessage;
  delete req.session.authErrorMessage;
  res.render('auth/admin/login', { authErrorMessage });
};

const adminLoginPost = tryCatch(async (req, res) => {
  const sanitizedBody = sanitizeObject(req.body);
  const { adminUsername, adminPassword } = sanitizedBody;

  // Find the user by their username
  const admin = await Admin.findOne({ adminUsername });
  if (!admin) {
    throw new APIError('Invalid username provided', 401);
  }

  if (admin.adminRole !== 'Admin') {
    throw new APIError('Access forbidden. Only merchants are allowed.', 403);
  }

  const passwordMatch = await bcrypt.compare(
    adminPassword,
    admin.adminPassword
  );
  if (!passwordMatch) {
    throw new APIError('Invalid password provided', 401);
  }

  const adminAccessToken = jwt.sign(
    { id: admin._id, adminRole: admin.adminRole },
    config.jwtSecret,
    { expiresIn: config.adminAccessTokenExpireTime }
  );
  const adminRefreshToken = jwt.sign(
    { id: admin._id, adminRole: admin.adminRole },
    config.jwtSecret,
    { expiresIn: config.adminRefreshTokenExpireTime }
  );

  req.session.adminAccessToken = adminAccessToken;
  req.session.adminRefreshToken = adminRefreshToken;

  // Set the tokens as cookies
  res.cookie('adminAccessToken', adminAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('adminRefreshToken', adminRefreshToken, {
    httpOnly: true,
    secure: true,
  });

  const adminRedirectUrl = '/admin/index';

  logger.info('Admin login successful');
  res.status(200).json({
    adminRedirectUrl,
    success: true,
    message: 'Admin login successful',
  });
});

// refreshToken controller
const adminRefreshToken = tryCatch((req, res) => {
  const adminRefreshToken = req.cookies.adminRefreshToken;
  if (!adminRefreshToken) {
    throw new APIError('Admin refresh token not provided', 401);
  }

  jwt.verify(
    adminRefreshToken,
    config.jwtSecret,
    (err, decodedAdminRefreshToken) => {
      if (err) {
        // Handle invalid refresh token
        throw new APIError('Invalid user refresh token', 403);
      } else {
        const newAdminAccessToken = jwt.sign(
          { id: decodedAdminRefreshToken.id },
          config.jwtSecret,
          { expiresIn: config.adminAccessTokenExpireTime }
        );

        // Log message indicating a new access token is generated
        logger.info(
          'New access token generated for admin:',
          newAdminAccessToken
        );

        res.cookie('adminAccessToken', newAdminAccessToken, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({ adminAccessToken: newAdminAccessToken });
      }
    }
  );
});

module.exports = {
  registerAdmin,
  registerAdminPost,
  adminLogin,
  adminLoginPost,
  adminRefreshToken,
};
