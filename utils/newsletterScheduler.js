const cron = require('node-cron');
const { NewsLetter } = require('../models');
const logger = require('../logger/logger');
const nodemailer = require(`nodemailer`);
const config = require('../configs/customEnvVariables');

// Send email to the applicant
const transporter = nodemailer.createTransport({
  service: config.mailerService,
  auth: {
    user: config.nodemailerEmail,
    pass: config.nodemailerPassword,
  },
});

// newsletterMessages
const getNewsletterMessage = (newNewsletter) => {
  const subscriberName = newNewsletter.subscriberName || 'Subscriber';
  let msg;

  if (config.nodeEnv === 'development') {
    // Production environment message
    msg = `
          <p>Dear ${subscriberName},</p>
          <p>Welcome to Korex StyleHub's newsletter!</p>
      `;
  } else {
    // Development environment message
    msg = `
          <p>Dear ${subscriberName},</p>
          <p>This is a default message for testing purposes in the development environment.</p>
  
      `;
  }

  return msg;
};

async function sendNewsletter(subscribers) {
  try {
    for (const subscriber of subscribers) {
      // Generate newsletter message
      const message = getNewsletterMessage(subscriber);

      const mailOptions = {
        from: config.nodemailerEmail,
        to: subscriber.subscriberEmail,
        subject: 'Thank You for Joining Korex StyleHub newsletter!',
        html: message,
        attachments: [
          {
            filename: 'companyLogo.jpg',
            path: './public/img/companyLogo.jpg',
            cid: 'companyLogo',
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error('Email sending error:', error);
          // Instead of returning a response, handle the error here
          logger.error('Error sending email:', error);
        } else {
          logger.info('Email sent:', info.response);
        }
      });
    }
  } catch (error) {
    logger.error('Error sending newsletter:', error);
  }
}

async function getAllSubscribers() {
  try {
    const newsLetters = await NewsLetter.find({}, 'subscriberEmail');
    return newsLetters.map((newsLetter) => ({
      subscriberEmail: newsLetter.subscriberEmail,
    }));
  } catch (error) {
    logger.error('Error fetching subscribers:', error);
    return [];
  }
}

// Schedule newsletter to be sent every day at 8:00 AM
const newsletterJob = cron.schedule('0 8 * * *', async () => {
  try {
    const subscribers = await getAllSubscribers();
    await sendNewsletter(subscribers);
  } catch (error) {
    logger.error('Error sending newsletter:', error);
  }
});

module.exports = newsletterJob;
