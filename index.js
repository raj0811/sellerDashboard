const express = require('express');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const port = 8015;
require('dotenv').config();
const db=require('./config/mongoose');

const session = require('express-session');
const flash = require('connect-flash');
const customMware= require('./config/middleware')
const app = express();
var expressLayouts = require('express-ejs-layouts');
app.use(express.static('assets'));

var bodyParser = require('body-parser')
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayouts);

const MongoStore = require('connect-mongo');


console.log(process.env.CLOUDINARY_API_SECRET);
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });



const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

app.use(session({ 
    name: 'seller dashboard',
    secret: 'your-secret-key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100000)
    },
    store: MongoStore.create({

        mongoUrl: 'mongodb://localhost/sellerdashboard',
        autoRemove: 'disabled'

    },
        function (err) {
            console.log(err || 'error in connect - mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressLayouts);

app.use(passport.setAuthenticatedUser)

app.set('view engine', 'ejs');
app.set('views', './views');


app.use(flash());
app.use(customMware.setFlash)
app.use('/', require('./routes'));


app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
      }
      console.log(`Server is running on port: ${port} `);
     
  
})