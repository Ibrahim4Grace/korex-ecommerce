const mongoose = require(`mongoose`);
const newsLetterSchema = new mongoose.Schema({
    
    subscriberEmail:{
        type: String,
        required: true,
    },
    date_added: {
        type: Date,
        default:Date.now()
    },
});

const NewsLetter = mongoose.model('NewsLetter', newsLetterSchema);

module.exports =  NewsLetter



