const express = require('express');
const router = express.Router();

// Import route handlers
const landingPageRoute = require('../routes/landingPageRoute');
const userAuthRoute = require('../routes/authUserRoute');
const userRoute = require('../routes/userRoute');

const merchantAuthRoute = require('../routes/authMerchantRoute');
const merchantRoute = require('../routes/merchantRoute');

const adminAuthRoute = require('../routes/authAdminRoute');
const adminRoute = require('../routes/adminRoute');

const middleware = require('../middlewares/expressMiddlewares');

//middlewares
router.use(middleware);

//IMPORT THE ROUTE FILES

// Mount the landing page route
router.use('/', landingPageRoute);

// Mount the user authentication routes under /auth/user
router.use('/auth/user', userAuthRoute);
router.use('/', userAuthRoute);

router.use('/user', userRoute);
router.use('/', userRoute);

// Mount the merchant authentication routes under /auth/merchant
router.use('/auth/merchant', merchantAuthRoute);
router.use('/', merchantAuthRoute);
router.use('/merchant', merchantRoute);
router.use('/', merchantRoute);

// Mount the admin authentication routes under /auth/admin
router.use('/auth/admin', adminAuthRoute);
router.use('/admin', adminRoute);

module.exports = router;
