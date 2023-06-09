const Seller = require("../models/user")
const cloudinary = require('cloudinary').v2;
const Shop = require('../models/shop')
const fs = require('fs-extra');
const Inventory = require("../models/inventory");



module.exports.Home = (req, res) => {

    try {
        //  if user is already logged in it will redirect to dashboard
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard')

        }
        return res.render('home', {
            title: 'Home'
        })
    } catch (err) {
        console.log(err);
    }

}

// create account
module.exports.create = async function (req, res) {
    try {

        console.log(req.body.email);


        if (req.body.password != req.body.confirmPassword) {

            req.flash('error', 'Pasword Missmatched');
            return res.redirect('back');
        }

        const user = await Seller.findOne({ email: req.body.email });

        if (!user) {
            const newUser = await Seller.create(req.body);
            console.log("Account created")
            req.flash('success', 'Added');
            return res.redirect('back');
        } else {
            console.log("User Already Exist")
            req.flash('error', 'User Already Exist');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error', 'User Not Created');
        console.log("error while signing up:", error);
        return res.redirect('back');
    }
}

// login
module.exports.createSession = function (req, res) {
    try {

        req.flash('success', 'Logged in');
        return res.redirect('/dashboard')
    } catch (err) {

        console.log(err);
    }
}

module.exports.renderDahboard = async (req, res) => {
    // req.flash('success', 'Logged in');
    const userId = req.user._id
    return res.render('dashboard', {
        title: "dashboard",
        userId

    })
}

module.exports.renderstoreinfo = async (req, res) => {
    return res.render('addstoreinfo', {
        title: "addstoreinfo"
    })
}


module.exports.addShopdeails = async (req, res) => {
    try {
        const { address, gst, openingTime, closingTime } = req.body;

        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' });
        }

        const imageFile = req.file;

        // Upload the image file to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.path);

        const userId = req.user._id;

        // Check if the shop details already exist for the user
        const existingShopDetails = await Shop.findOne({ user: userId });

        if (existingShopDetails) {
            // Update the existing shop details
            existingShopDetails.address = address;
            existingShopDetails.gstNumber = gst;
            existingShopDetails.logo = result.secure_url;
            existingShopDetails.openingTime = openingTime;
            existingShopDetails.closingTime = closingTime;
            await existingShopDetails.save();
        } else {
            // Create a new shop document
            const newShopDetails = new Shop({
                address,
                gstNumber: gst,
                logo: result.secure_url,
                openingTime,
                closingTime,
                user: userId
            });
            await newShopDetails.save();
        }

        const folderPath = 'public/images';
        await fs.emptyDir(folderPath);

        req.flash('success', 'Added');
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
    }
};


module.exports.renderCategory = async (req, res) => {
    return res.render('addcategory', {
        title: "Add Category"
    })
}

module.exports.insertCategory = async (req, res) => {
    try {
        const { category, subcategory } = req.body;

        console.log(req.user._id);
        // Find the existing document in the database
        const shop = await Shop.findOne({ user: req.user._id });
        if (!shop) {
            req.flash('error', 'add shop details first');
            return res.redirect('/add-info')
        }
        console.log(shop);
        // Update the category and subcategory fields
        shop.category = category;
        shop.subCategory = subcategory;

        //   Save the updated document
        await shop.save();

        //   Redirect or send a response as needed
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        // Handle the error and send an appropriate response
    }
};


module.exports.renderInventory = async (req, res) => {
    return res.render('addinventory', {
        title: 'Add inventory'
    })
}


module.exports.insertInventory = async (req, res) => {
    try {
        const { productName, category, subcategory, mrp, sellingPrice, quantity } = req.body;

        // Convert inputs to lowercase
        const lowerCaseProductName = productName.toLowerCase();
        const lowerCaseCategory = category.toLowerCase();
        const lowerCaseSubcategory = subcategory.toLowerCase();

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' });
        }

        const imageFile = req.file;

        // Upload the image file to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.path);

        const userId = req.user._id;
        const newProduct = new Inventory({
            productName: lowerCaseProductName,
            category: lowerCaseCategory,
            subcategory: lowerCaseSubcategory,
            mrp,
            sellingPrice,
            quantity,
            user: userId,
            image: result.secure_url,
        });

        await newProduct.save();

        const folderPath = 'public/images';
        await fs.emptyDir(folderPath);

        // Redirect or send a response as needed
        req.flash('success', 'Added');
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
    }
};




module.exports.searchPage = async (req, res) => {
    try {


        const userId = req.params.sellerId
        console.log(userId);

        const seller = await Seller.findById(userId)


        console.log(seller._id);
        // console.log(seller.businessName);
        return res.render('searchpage', {
            title: "Search",
            seller,
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports.searchResult = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const search = req.body.searchedItem;
        console.log(search);

        const searchItem = search.toLowerCase();

        const product = await Inventory.find({
            user: sellerId,
            $or: [
                { productName: { $regex: searchItem, $options: 'i' } },
                { category: { $regex: searchItem, $options: 'i' } },
                { subcategory: { $regex: searchItem, $options: 'i' } }
            ]
        });

        // console.log(product);

        // console.log(sellerId);

        const userId = req.params.sellerId;
        const seller = await Seller.findById(userId);

        res.render('searchpage', { title: 'searchresult', seller, product });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('error', 'Logged out');
        res.redirect('/')

    });

}