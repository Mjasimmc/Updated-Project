
const express = require('express')
const router = express();
const multer = require('multer');
const imagestore = require('../middleware/storage')

const path = require('path')

const storage = imagestore
const upload = multer({storage:storage})

router.set('views', './views/admin')
const adminController = require('../controllers/admin')
const sessionCheck = require('../middleware/adminSession')

// admin login
router.get('/',sessionCheck.notLogged,adminController.loadSignIn)
router.post('/login',sessionCheck.notLogged,adminController.postlogin)

// logout
router.get('/logout',adminController.logout)

// admin home
router.get('/home',sessionCheck.logged,adminController.loadHome)

// profile
router.get('/profile',sessionCheck.logged,adminController.loadprofile)


// viewing and user controlling
router.get('/userlist',sessionCheck.logged,adminController.userlist)    
router.post('/block',sessionCheck.logged,adminController.block)
router.post('/unblock',sessionCheck.logged,adminController.unblock)


// products adding
router.get('/addproduct',sessionCheck.logged,adminController.loadinsertproduct)
router.post('/addproduct',sessionCheck.logged,upload.array('image',10),adminController.insertProduct)

// viewing and soft deleting
router.get('/productlist',sessionCheck.logged,adminController.productlist)
router.get('/edit-product/:id',sessionCheck.logged,adminController.loadEditProduct)
router.post('/update-product',sessionCheck.logged,adminController.updateProduct)
router.post('/deleteproduct',sessionCheck.logged,adminController.deleteproduct)
router.post("/undodelete",sessionCheck.logged,adminController.undodeleteproduct)
router.post("/removeimage",sessionCheck.logged,adminController.removeImage)
// category
router.get('/categorylist',sessionCheck.logged,adminController.categorylist)
router.get('/category',sessionCheck.logged,adminController.loadcategory)
router.post('/addcategory',sessionCheck.logged,adminController.insertCategory)

router.get('/orderList',sessionCheck.logged,adminController.loadOrderList)


router.get('/orderList/:id',sessionCheck.logged,adminController.viewOrder)

router.get('/coupon-list',sessionCheck.logged,adminController.listCoupon)
router.get('/addcoupon',sessionCheck.logged,adminController.loadAddCoupon)
router.post('/addcoupon',sessionCheck.logged,adminController.postAddCoupon) 
router.post("/updateOrder",sessionCheck.logged,adminController.updateOrder)

router.post("/addImage",sessionCheck.logged,upload.array('image',10),adminController.addImage)

router.get("/edit-category/:id",sessionCheck.logged,adminController.loadCategoryedit)
router.post("/updatecategory",sessionCheck.logged,adminController.updateCategory)

router.post("/delete-category",sessionCheck.logged,adminController.deleteCategory)
router.post("/undo-Category",sessionCheck.logged,adminController.undoCategory)

module.exports = router;