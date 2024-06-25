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


// Function to send password reset email to users
const sendVerificationEmail = async (newUser,verificationCode) => {
    // Email content for unverified user
    const unverifiedMsg = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear ${newUser.userFirstName} ${newUser.userLastName}, welcome to Korex StyleHub Service.</p>
    <p>Use the 6-digit Code provided below to verify your email:</p>
    <p>Your verification code is: ${verificationCode}</p>
    <p>If you didn't register, please ignore this email.</p>
    <p>Best regards, <br> The Korex StyleHub Team</p>`;

// Configure email options
const mailOptions = {
  from: config.nodemailerEmail,
    to: newUser.userEmail,
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

const verifyEmailMsg = async (user) => {
  const verifiedMsg = `
  <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear  ${user.userFirstName} ${user.userLastName} ,  We are thrilled to welcome you to Korex StyleHub Service. </p>
    
  <p>Here are some important details to get you started:</p>
  <ul>
      <li>Full Name: ${user.userFirstName} ${user.userLastName}</li>
      <li>Email Address: ${user.userEmail}</li>
      <li>Phone Number: ${user.userNumber}</li>
      <li>Username: ${user.userUsername}</li>
      <li>Home Address: ${user.userAddress}</li>
      <li>City: ${user.userCity}</li>
      <li>State: ${user.userState}</li>
  </ul>
    
  <p>Thank you for registering with Korex StyleHub! We are delighted to welcome you to our platform</p>
    
  <p>Your account has been successfully created, you can now explore all the features we have to offer.</p>
    
  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>
    
  <p>Best regards,<br>
  The Korex StyleHub Team</p>`;
  
      // Send the second email for verified users
  const mailOptions = {
      from: config.nodemailerEmail,
      to: user.userEmail,
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

const requestVerificationMsg = async (user,verificationCode) => {
  const mailOptions = {
      from: config.nodemailerEmail,
      to: user.userEmail,
      subject: 'Verify Your Email - Korex StyleHub',
      html: `<p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
      <p>Dear ${user.userFirstName} ${user.userLastName}, welcome to Korex StyleHub Service.</p>
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

const forgetPasswordMsg = async (user,resetLink) => {
  const msg = `
  <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${user.userFirstName} ${user.userLastName},</p>

  <p>We are writing to confirm your password recovery with Korex StyleHub.</p>
  <p>Reset your password here: <a href="${resetLink}">Click here to reset your password</a></p>

  <p>If you didn't request this verification, please ignore this email.</p>

  <p>If you encounter any issues or need further assistance, feel free to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  Korex StyleHub</p>`;

  const mailOptions = {
  from: config.nodemailerEmail,
  to: user.userEmail,
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
      } else {
          logger.info('Email sent:', info.response);
      }
  });
};

const resetPasswordMsg = async (user) =>{
  const msg = `
  <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${user.userFirstName} ${user.userLastName},</p>

  <p>We are writing to confirm your password recovery with Korex StyleHub.</p>
  <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>

  <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  Korex StyleHub</p>
`;

const mailOptions = {
  from: config.nodemailerEmail,
  to: user.userEmail,
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


// Contact For Any Queries Messages
const contactQueriesMsg = async (newContactUs) =>{
  const msg = `
  <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${newContactUs.contactUsName},</p>

  <p>Thank you for reaching out to us!</p>
  <p>We truly appreciate you taking the time to contact us regarding your inquiry. Your message has been received, and we will make sure to address it promptly.</p>

  <p>Our team is dedicated to providing excellent customer service, and we are committed to assisting you with any questions or concerns you may have.</p>

  <p>Rest assured that we have received your message, and a member of our team will get back to you as soon as possible.</p>

  <p>Once again, thank you for choosing Korex StyleHub. We look forward to assisting you! </p>

  <p>If you did not request this password reset, please contact us immediately. at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you</p>

  <p>Warm regards,<br>
  Korex StyleHub</p>`;

  const mailOptions = {
      from: config.nodemailerEmail,
      to: newContactUs.contactUsEmail,
      subject: 'Thank You for Contacting Korex StyleHub!',
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

// newsletter Messages
const newNewsLetterMsg = async (newNewsLetter) =>{
  const subscriberName = newNewsLetter.subscriberName || 'Subscriber';
  const msg = `
  <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
  <p>Dear ${subscriberName},</p>

  <p>Welcome to Korex StyleHub's newsletter!</p>
  
  <p>Thank you for subscribing to our newsletter. We're excited to have you on board.</p>

  <p>Our newsletter will keep you updated with the latest products, promotions, and news from Korex StyleHub.</p>

  <p>If you have any questions or need assistance, feel free to reach out to us at any time. We're here to help!</p>

  <p>Once again, thank you for joining us. We appreciate your support and look forward to keeping in touch with you!</p>

  <p>Warm regards,<br>
  Korex StyleHub</p>`;

  const mailOptions = {
      from: config.nodemailerEmail,
      to: newNewsLetter.subscriberEmail,
      subject: 'Thank You for Joining Korex StyleHub newsletter!',
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


//update user inofrmation message 
const updateProfileMsg = async (user) => {
    const updateProfile = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear  ${user.userFirstName} ${user.userLastName} ,  We hope this message finds you well. We wanted to inform you that there has been an update to your information in our database. The details that have been modified include:</p>

    <p>Here are some important details to get you started:</p>
    <ul>
        <li>Full Name: ${user.userFirstName} ${user.userLastName}</li>
        <li>Email Address: ${user.userEmail}</li>
        <li>Phone Number: ${user.userNumber}</li>
        <li>Username: ${user.userUsername}</li>
        <li>Date Of Birth: ${user.userDob}</li>
        <li>Home Address: ${user.userAddress}</li>
        <li>City: ${user.userCity}</li>
        <li>State: ${user.userState}</li>
        <li>Country: ${user.userCountry}</li>
    </ul>
      
    <p>Please review the changes to ensure that they accurately reflect your information. If you believe any information is incorrect or if you have any questions regarding the update, please don't hesitate to reach out to our administrative team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your satisfaction is important to us, and we are here to assist you.</p>

    <p>We value your continued association with us, and it's important to us that your records are kept up-to-date for your convenience and our records.</p>
      
    <p>Best regards,<br>
    The Korex StyleHub Team</p>`;
    
        // Send the second email for verified users
    const mailOptions = {
        from: config.nodemailerEmail,
        to: user.userEmail,
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

//Order confirmation message 
const purchaseConfirmationMsg = async (user, orderDetails) => {
    const currentYear = new Date().getFullYear();
    const orderConformation = `
    <div class="email-wrapper">

        <div class="email-preheader">
            <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p>
            <p class="tagline">Thank you for shopping with us</p>
        </div>

        <div class="email-container">
            <div class="email-title">Order summary</div>

            <div class="row">
                <div class="col-md-15">
                    <small class="col-title">Order Ref.</small>
                    <div class="col-text -main">${orderDetails.orderNumber}</div>
                </div>
                <div class="col-md-15">
                    <small class="col-title">Order Date</small>
                    <div class="col-text">${new Date(orderDetails.date_added).toLocaleDateString()}</div>
                </div>
                <div class="col-md-15">
                    <small class="col-title">No. of Items</small>
                    <div class="col-text">${orderDetails.cartItems.length}</div>
                </div>
                <div class="col-md-15">
                    <small class="col-title">Grand Total</small>
                    <div class="col-text">${orderDetails.totalAmount}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 address">
                     <small class="col-title">Billing address</small>
                    <div class="text">${user.userFirstName} ${user.userLastName}<br>
                       ${user.userAddress}<br>
                       ${user.userCity} ${user.userState}<br>
                       ${user.userCountry}
                    </div>
                </div>
                <div class="col-md-6 address">
                    <small class="col-title">Delivery address</small>
                    <div class="text">${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}</br>
                        ${orderDetails.shippingAddress.addressLine1}<br>
                        ${orderDetails.shippingAddress.city} ${orderDetails.shippingAddress.state}<br>
                        ${orderDetails.shippingAddress.country}
                    </div>
                </div>
            </div>

            <div class="row">
                <p class="col-md-12 content-title -centered">Product ordered</p><br>
            </div>
            ${orderDetails.cartItems.map(item => `
                <div class="row">
                    <div class="col-md-6 artwork-card">
                        <div class="artwork-card-image">
                            <img src="${item.productImages[0]}" alt="${item.productName}"/>
                        </div>

                        <div class="artwork-card-info">
                            <div class="title">${item.productName}</div>
                            <div class="info">
                                <div class="subject">Qty: ${item.productQuantity}</div>
                                <div class="subject">Size: ${item.productSize}</div>
                                <div class="subject">Col: ${item.productColor}</div>
                                <div class="price">Price: ${item.productPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>`).join('')}
                <div class="row">
                    <div class="content-area">
                        <p>We’ve received your order and the items are being carefully packaged. You will receive a e-mail with the Shipment Tracking number as it is generated.</p>
                       

                        <p>The Estimated Delivery time is updated as a parcel is collected. While our Shipping Partners do their utmost to deliver to your doorstep on the date provided, it remains an estimation.</p>
                    </div>
                </div>
            </div>

            <div class="email">
                <p>This email was sent to: ${user.userEmail}</p>
            </div>

            <div class="copywrite">
                <p>© ${currentYear} StyleHub. All Rights Reserved.</p>
            </div>

            <div class="address">
                <p class="name">${config.officeAddress}<br>
                   ${config.officeCity}  ${config.officeState}.<br>
                   ${config.officeCountry}
                </p>
            </div>
        </div>
    </div>
    `;
    
    const mailOptions = {
        from: config.nodemailerEmail,
        to: user.userEmail,
        subject: 'Order Confirmation',
        html: orderConformation,
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
            logger.error('Email sending error:', error);
        } else {
            logger.info('Email sent:', info.response);
        }
    });
};

//Reporting Seller
const reportSellerMsg = async (user, newReportSeller) => {

    const imageHtml = newReportSeller.image.map(img => {
        return `<li>Proof Image: <img src="${img.imageUrl}" alt="Proof Image" style="max-width: 200px; max-height: 200px;"></li>`;
    }).join('');
    
    const updateProfile = `
    <p><img src="cid:companyLogo" alt="companyLogo" style="width: 100%; max-width: 600px; height: auto;"/></p><br>
    <p>Dear  ${user.userFirstName} ${user.userLastName},</p>

    <p>We hope this message finds you well. We wanted to inform you that your report regarding a seller has been successfully submitted. We appreciate your diligence in helping us maintain a safe and trustworthy community. Below are the details of your report:</p>

    <ul>
        <li>Product URL: ${newReportSeller.productUrl}</li>
        <li>Type of Issue: ${newReportSeller.reportGoodsType}</li>
        <li>Reason for Report: ${newReportSeller.reasonForReport}</li>
        ${imageHtml}
    </ul>
      
    <p>We are currently reviewing the information you provided and will take the necessary actions to address the issue. If we need any additional information or clarification, we will reach out to you.</p>

    <p>Should you have any questions or need further assistance, please don't hesitate to contact our support team at <a href="tel:${phoneNumber}">${phoneNumber}</a> or <a href="mailto:${emailAddress}">${emailAddress}</a>. Your support in keeping our platform safe is invaluable to us.</p>
    
    <p>Thank you for your cooperation.</p>
      
    <p>Best regards,<br>
    The Korex StyleHub Team</p>`;
    
        // Send the second email for verified users
    const mailOptions = {
        from: config.nodemailerEmail,
        to: user.userEmail,
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


module.exports =  { sendVerificationEmail,verifyEmailMsg,requestVerificationMsg,forgetPasswordMsg,resetPasswordMsg, contactQueriesMsg,newNewsLetterMsg, updateProfileMsg, purchaseConfirmationMsg,reportSellerMsg};

