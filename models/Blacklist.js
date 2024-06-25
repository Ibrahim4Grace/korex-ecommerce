const mongoose = require(`mongoose`);

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness of tokens
        index: true, // Add index for faster queries
        ref: "User",
    },
    date_added: {
        type: Date,
        default:Date.now()
    },

});



const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports =  Blacklist


// Finally, you may want to add a logout functionality. For that, you have two basic options. One is to blacklist the request cookie on logout, the other is to invalidate the cookie by sending an invalid cookie to the client. The latter is not advisable because if the previous cookie was kept somewhere before logout, it can still be used to log in. Here, you will be implementing the first.