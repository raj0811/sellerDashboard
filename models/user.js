const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt'); 

const sellerSchema = new mongoose.Schema({
    
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    businessName:{
        type: String,
        required: true
    
    }

},{
    timestamps: true
});




sellerSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        next();
    }
})

const Seller = mongoose.model('Seller',sellerSchema);

module.exports = Seller;