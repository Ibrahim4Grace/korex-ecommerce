const multer = require('multer');


// Multer config
const productImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/productImage/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now());
        }
    }),limits: {
        fileSize: 1000000,
    },
});

const merchantImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/merchantImage/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now());
        }
    }),limits: {
        fileSize: 1000000,
    },
});

const userImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/userImage/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now());
        }
    }),limits: {
        fileSize: 1000000,
    },
});

const adminImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/adminImage/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '_' + Date.now());
        }
    }),limits: {
        fileSize: 1000000,
    },
});

const reportImage = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './public/reportImage/'); // Adjust path as needed
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now());
      }
    }),
    limits: {
      fileSize: 1000000, // Adjust limit in bytes (here, 1MB)
    },
});
  


module.exports ={productImage,merchantImage,userImage,adminImage,reportImage};

