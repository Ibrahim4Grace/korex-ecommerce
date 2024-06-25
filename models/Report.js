const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    productUrl: { type: String, required: true, },
    reportGoodsType: { type: String, required: true, },
    reasonForReport: { type: String, required: true, maxlength: 250,},
    image: [{
        imageUrl: String,
        imageId: String
    }],
    date_added: { type: Date, default:Date.now() },
});

const ReportSeller = mongoose.model('ReportSeller', reportSchema);

module.exports = ReportSeller;
