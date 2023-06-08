const express = require('express');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const port = 80;
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

cloudinary.config({ 
    cloud_name: 'dw8rpoiil', 
    api_key: '143649366316163', 
    api_secret: 'GsZF65V_kqxrzhET0iYACVgTRJg' 
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