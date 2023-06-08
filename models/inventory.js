const mongoose = require('mongoose');


const inventorySchema = new mongoose.Schema({
    
    productName: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      subcategory: {
        type: String
      },
      mrp: {
        type: Number,
        required: true
      },
      sellingPrice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
      },
      image: {
        type: String
      }
    }, {
      timestamps: true
    });
    





const Inventory = mongoose.model('Inventory',inventorySchema);

module.exports = Inventory;