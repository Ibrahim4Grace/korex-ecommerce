const { sendVerificationEmail,verifyEmailMsg,requestVerificationMsg,forgetPasswordMsg,resetPasswordMsg, contactQueriesMsg,newNewsLetterMsg, updateProfileMsg, purchaseConfirmationMsg,reportSellerMsg }  = require('./userMsgMailer');

const { merchantRegistrationMsg,merchantVerifyEmailMsg,merchantRequestVerifyMsg,merchantForgetPswdMsg,merchantResetPswdMsg, productRegistrationMsg,productUpdateMsg, updateMerchantProfileMsg}  = require('./merchantMsgMailer');

const { adminRegistrationMsg,updateAdminProfileMsg}  = require('./adminMsgMailer');




module.exports = { 
    sendVerificationEmail,verifyEmailMsg,
    requestVerificationMsg,forgetPasswordMsg,
    resetPasswordMsg, contactQueriesMsg,
    newNewsLetterMsg, updateProfileMsg, 
    purchaseConfirmationMsg,reportSellerMsg, 
    
    merchantRegistrationMsg,merchantVerifyEmailMsg,
    merchantRequestVerifyMsg,merchantForgetPswdMsg,
    merchantResetPswdMsg, productRegistrationMsg,
    productUpdateMsg,updateMerchantProfileMsg,

    adminRegistrationMsg,updateAdminProfileMsg
};
