const mongoose = require(`mongoose`);

const adminSchema = new mongoose.Schema({

    adminFirstName:{ type: String, required: true },
    adminLastName:{ type: String, required: true },
    adminPassword:{ type: String, required: true },
    adminEmail:{ type: String, required: true },
    adminUsername:{ type: String, required: true },
    adminAddress:{ type: String, required: true },
    adminCity:{ type: String, required: true },
    adminState:{ type: String, required: true },
    adminRole:{type: String, default: 'Admin',},
    image: [{ imageUrl: String, imageId: String }],
    date_added: { type: Date, default: Date.now() }

});


const Admin = mongoose.model('Admin', adminSchema);

module.exports =  Admin

