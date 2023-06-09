require('dotenv').config();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/sellerdashboard')
mongoose.connect("mongodb+srv://mrunknown0086:n8RBNbztJXIpxoaa@sellercluster.yfvfadd.mongodb.net/?retryWrites=true&w=majority")

//accuire the connectiontion
const db = mongoose.connection;


//error
db.on('error', console.error.bind(console, 'error in connecting to db'));

//up and runnning
db.once('open', function() {
    console.log("successfully connected to the database");
});