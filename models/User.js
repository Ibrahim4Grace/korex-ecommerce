const mongoose = require(`mongoose`);
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userUsername: { type: String, required: true },
  userAddress: { type: String, required: true },
  userCity: { type: String, required: true },
  userState: { type: String, required: true },
  userCountry: { type: String, required: true },
  userDob: { type: String, required: true },
  userNumber: { type: String, required: true },
  image: [{ imageUrl: String, imageId: String }],
  userPassword: { type: String, required: true },
  userRole: { type: String, default: 'User' },
  accountStatus: { type: String, default: 'Active' },
  failedLoginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

  verificationToken: {
    token: { type: String, default: null },
    expires: { type: Date, default: null },
  },

  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  paystack_ref: { type: String },
  totalAmount: { type: String },
  paymentStatus: { type: String },

  date_added: { type: Date, default: Date.now() },
});

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 20 * 60 * 1000); // Set to 20 minutes from now
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
