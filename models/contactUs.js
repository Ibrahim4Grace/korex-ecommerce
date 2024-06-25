const mongoose = require(`mongoose`);
const contactUsSchema = new mongoose.Schema({

    contactUsName:{
        type: String,
        required: true
    },
    contactUsEmail:{
        type: String,
        required: true
    },
    contactUsSubject:{
        type: String,
        required: true
    },
    contactUsMsg:{
        type: String,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now()
    }
   

});



const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports =  ContactUs

