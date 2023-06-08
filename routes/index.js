const express = require('express');
const router = express.Router();
const passport = require('passport');
const homeController = require('../controllers/homeControllers')

const upload = require('../middleware/upload')
router.get('/',homeController.Home)
router.post('/create-account',homeController.create)

router.post('/login', passport.authenticate(
    'local', { failureRedirect: '/' }
), homeController.createSession);


router.get('/dashboard',passport.checkAuthentication,homeController.renderDahboard)

router.get('/add-info',passport.checkAuthentication,homeController.renderstoreinfo)

router.post('/addstore',upload.single('image'),homeController.addShopdeails)

router.get('/add-category',passport.checkAuthentication,homeController.renderCategory)

router.post('/insert-category',homeController.insertCategory)

router.get('/add-inventory',passport.checkAuthentication,homeController.renderInventory)

router.post('/insert-inventory',upload.single('image'),homeController.insertInventory)


module.exports = router; 