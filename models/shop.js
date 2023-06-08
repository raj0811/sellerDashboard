const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt'); 

const shopSchema = new mongoose.Schema({
    
    address: {
        type: String,
        required: true
      },
      gstNumber: {
        type: String,
        required: true
      },
      logo: {
        type: String
      },
      openingTime: {
        type: String,
        required: true
      },
      closingTime: {
        type: String,
        required: true
      },
      category: {
        type: String,
        // required: true
      },
      subCategory: {
        type: String
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
      }
    

},{
    timestamps: true
});





const Shop = mongoose.model('Shop',shopSchema);

module.exports = Shop;