const nodemailer = require(`nodemailer`);
const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');

// Send email to the applicant
const transporter = nodemailer.createTransport({
    service: config.mailerService,
    auth: {
        user: config.nodemailerEmail,
        pass: config.nodemailerPassword
    }
});

const phoneNumber = config.companyNumber;
const emailAddress = config.companyEmail;

//register merchant account
const merchantRegistrationMsg = async (newMerchant,verificationCode) => {
    // Email content for unverified user
    const unverifiedMsg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear ${newMerchant.merchantFirstName} ${newMerchant.merchantLastName}, welcome to Korex StyleHub Market Service.</p>
    <p>Use the 6-digit Code provided below to verify your email:</p>
    <p>Your verification code is: ${verificationCode}</p>
    <p>If you didn't register, please ignore this email.</p>
    <p>Best regards, <br> The Korex StyleHub Team</p>`;

// Configure email options
const mailOptions = {
    from: config.nodemailerEmail,
    to: newMerchant.merchantEmail,
    subject: 'Welcome to Korex StyleHub - 6-digit Verification Code',
    html: unverifiedMsg,
    attachments: [
        {
            filename: 'companyLogo.jpg',
            path: './public/img/companyLogo.jpg',
            cid: 'companyLogo'
        }
    ]
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logger.info('Email sending error:', error);
    } else {
        logger.info('Email sent:', info.response);
    }
});

};

// Verify email to merchant
const merchantVerifyEmailMsg = async (merchant) => {
    const verifiedMsg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear  ${merchant.merchantFirstName} ${merchant.merchantLastName} ,  Welcome to Korex StyleHub Service! We are thrilled to have you join us. </p>
      
    <p>Here are the details you provided during registration:</p>
    <ul>
        <li>Full Name: ${merchant.merchantFirstName} ${merchant.merchantLastName}</li>
        <li>Email Address: ${merchant.merchantEmail}</li>
        <li>Phone Number: ${merchant.merchantPhone}</li>
        <li>Username: ${merchant.merchantUsername}</li>
        <li>Home Address: ${merchant.merchantAddress}</li>
        <li>City: ${merchant.merchantCity}</li>
        <li>State: ${merchant.merchantState}</li>
    </ul>
      
    <p>Thank you for choosing Korex StyleHub! Your account has been successfully created, granting you access to our platform's exciting features</p>
      
    <p>Should you have any inquiries or require assistance, please don't hesitate to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>.Your satisfaction is our priority, and we are committed to providing you with the assistance you need.</p>
      
    <p>Best regards,<br>
    The Korex StyleHub Team</p>`;
    
        // Send the second email for verified users
    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Welcome to Korex StyleHub!',
        html: verifiedMsg,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };
    
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
        } else {
            logger.info('Email sent:', info.response);
        }
    });

};

//request verification message 
const merchantRequestVerifyMsg = async (merchant,verificationCode) => {
    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Merchant Verify Your Email - Korex StyleHub',
        html: `<p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
        <p>Use the 6-digit Code provided below to verify your email:</p>
        <p>Your verification code is: ${verificationCode}</p>
        <p>If you didn't register, please ignore this email.</p>
        <p>Best regards,<br>
        The Korex StyleHub Team</p>`,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//forget password
const merchantForgetPswdMsg = async (merchant,resetLink) => {
    const msg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear ${merchant.merchantFirstName} ${merchant.merchantLastName},</p>

    <p>We are writing to confirm your password recovery with Korex StyleHub.</p>
    <p>Reset your password here: <a href="${resetLink}">Click here to reset your password</a></p>

    <p>If you didn't request this verification, please ignore this email.</p>

    <p>If you encounter any issues or need further assistance, feel free to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

    <p>Warm regards,<br>
    Korex StyleHub</p>`;

    const mailOptions = {
    from: config.nodemailerEmail,
    to: merchant.merchantEmail,
    subject: 'Recover your password with Korex StyleHub!',
    html: msg,
    attachments: [
        {
            filename: 'companyLogo.jpg',
            path: './public/img/companyLogo.jpg',
            cid: 'companyLogo'
        }
    ]
};

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
            return res.status(500).json({ success: false, errors: [{ msg: 'Error sending email' }] });
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//reset password
const merchantResetPswdMsg = async (merchant) =>{
    const msg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear ${merchant.merchantFirstName} ${merchant.merchantLastName},</p>

    <p>We are writing to confirm your password recovery with Korex StyleHub.</p>
    <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>

    <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

    <p>Warm regards,<br>
    Korex StyleHub</p>`;

    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Password Reset Successful with Korex StyleHub!',
        html: msg,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
            return res.status(500).json({ success: false, errors: [{ msg: 'Error sending email' }] });
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//Register product
const productRegistrationMsg = async (newProduct, merchant) =>{
    const msg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear ${merchant.merchantFirstName} ${merchant.merchantLastName},</p>

    <p>Congratulations! Your new product has been successfully added to Korex StyleHub.</p>
    <p>Customers can now discover and purchase your latest offering.</p>

    <p>If you have any questions or need further assistance, feel free to contact us at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. We're here to support you in maximizing your sales.</p>

    <p>Best regards,<br>
    Korex StyleHub</p>`;

    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Your Product is Now on Korex StyleHub',
        html: msg,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
            return res.status(500).json({ success: false, errors: [{ msg: 'Error sending email' }] });
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//Editing product
const productUpdateMsg = async (updatedProduct, merchant) => {
    const updatedFields = [];

    if (updatedProduct.productName !== undefined) {
        updatedFields.push(`Product name (${updatedProduct.productName})`);
    }
    if (updatedProduct.productPrice !== undefined) {
        updatedFields.push(`Product price (${updatedProduct.productPrice})`);
    }
    if (updatedProduct.productShipping !== undefined) {
        updatedFields.push(`Shipping fee (${updatedProduct.productShipping})`);
    }
    if (updatedProduct.productCategory !== undefined) {
        updatedFields.push(`Product category (${updatedProduct.productCategory})`);
    }
    if (updatedProduct.productBrand !== undefined) {
        updatedFields.push(`Product brand (${updatedProduct.productBrand})`);
    }
    if (updatedProduct.productSize !== undefined) {
        updatedFields.push(`Product size (${updatedProduct.productSize})`);
    }
    if (updatedProduct.productColor !== undefined) {
        updatedFields.push(`Product color (${updatedProduct.productColor})`);
    }
    if (updatedProduct.productQuantity !== undefined) {
        updatedFields.push(`Product quantity (${updatedProduct.productQuantity})`);
    }
    if (updatedProduct.productDescription !== undefined) {
        updatedFields.push(`Product description (${updatedProduct.productDescription})`);
    }

    const updateMessage = updatedFields.length === 1 ? `the ${updatedFields[0]}` : `the following fields: ${updatedFields.join(', ')}`;

    const msg = `
        <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto; background-color:#F3F6F9;"/></p><br>
        <p>Dear ${merchant.merchantFirstName} ${merchant.merchantLastName},</p>

        <p>We're writing to inform you that ${updateMessage} of your product on Korex StyleHub has been successfully updated.</p>
        
        <p>With these changes, your customers will have access to the latest details about your products, helping them make informed purchasing decisions.</p>
        
        <p>If you have any further questions or need assistance, please don't hesitate to reach out to us at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Our team is always available to support you.</p>
        
        <p>Thank you for keeping your product information up-to-date!</p>
        
        <p>Best regards,<br>
        Korex StyleHub</p>`;

    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Your Product is Now updated on Korex StyleHub',
        html: msg,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
            return res.status(500).json({ success: false, errors: [{ msg: 'Error sending email' }] });
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//update merchant inofrmation message 
const updateMerchantProfileMsg = async (merchant) => {
    const updateProfile = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear  ${merchant.merchantFirstName} ${merchant.merchantLastName} ,  We hope this message finds you well. We wanted to inform you that there has been an update to your information in our database. The details that have been modified include:</p>

    <p>Here are some important details to get you started:</p>
    <ul>
        <li>Full Name: ${merchant.merchantFirstName} ${merchant.merchantLastName}</li>
        <li>Email Address: ${merchant.merchantEmail}</li>
        <li>Phone Number: ${merchant.merchantPhone}</li>
        <li>Username: ${merchant.merchantUsername}</li>
        <li>Home Address: ${merchant.merchantAddress}</li>
        <li>City: ${merchant.merchantCity}</li>
        <li>State: ${merchant.merchantState}</li>
        <li>Country: ${merchant.merchantCountry}</li>
    </ul>
      
    <p>Please review the changes to ensure that they accurately reflect your information. If you believe any information is incorrect or if you have any questions regarding the update, please don't hesitate to reach out to our administrative team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you.</p>

    <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
      
    <p>Best regards,<br>
    The Korex StyleHub Team</p>`;
    
        // Send the second email for verified users
    const mailOptions = {
        from: config.nodemailerEmail,
        to: merchant.merchantEmail,
        subject: 'Important Update: Your Information Has Been Modified!',
        html: updateProfile,
        attachments: [
            {
                filename: 'companyLogo.jpg',
                path: './public/img/companyLogo.jpg',
                cid: 'companyLogo'
            }
        ]
    };
    
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            logger.info('Email sending error:', error);
        } else {
            logger.info('Email sent:', info.response);
        }
    });

};


module.exports = { merchantRegistrationMsg,merchantVerifyEmailMsg,merchantRequestVerifyMsg,merchantForgetPswdMsg,merchantResetPswdMsg, productRegistrationMsg,productUpdateMsg, updateMerchantProfileMsg};
