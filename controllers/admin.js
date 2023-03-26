const UserModify = require('../models/user');
const productModidy = require('../models/product')
const adminDB = require('../models/admin')
const categorydata = require('../models/catogory')
const orderModel = require('../models/orders')
const couponModel = require('../models/coupon')


const path = require('path');
const { parse } = require('path');
require('dotenv').config({ path: __dirname + '../config/.env' })
const postlogin = async (req, res, next) => {
    try {
        const admindata = await adminDB.findOne()
        const email = admindata.email
        const password = admindata.password
        const useremail = req.body.email
        const userpassword = req.body.password
        if (email == useremail) {
            if (password == userpassword) {
                req.session.adminlogin = true
                res.redirect('/admin/home')
            } else {
                req.session.adminloginmessage = "password incorrect"
                res.redirect('/admin')
            }
        } else {
            req.session.adminloginmessage = "user Not found"
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadSignIn = async (req, res, next) => {
    try {
        alertMessage = req.session.adminloginmessage;
        req.session.adminloginmessage = ""
        res.render('signin', { alertMessage })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadHome = async (req, res, next) => {
    try {
        const orders = await orderModel.find({}).sort({}).populate("user")
        res.render('home', { orders })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const logout = async (req, res, next) => {
    try {
        req.session.adminlogin = false
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const userlist = async (req, res, next) => {
    try {
        const users = await UserModify.find({}).sort({ name: 1 })
        res.render('userlist', { users })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const block = async (req, res, next) => {
    try {
        const userid = req.body.user
        const user = await UserModify.findOneAndUpdate({ _id: userid }, { $set: { blockuser: true } })
        console.log(user);
        res.json({status:true})
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const unblock = async (req, res, next) => {
    try {
        const userid = req.body.user
        await UserModify.findOneAndUpdate({ _id: userid }, { $set: { blockuser: false } })
        res.json({status:true})

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadinsertproduct = async (req, res, next) => {
    try {
        const category = await categorydata.find({ delete: 0 })
        req.session.category = category._id;
        res.render('addproduct', { category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadcategory = async (req, res, next) => {
    try {
        res.render('addcategory')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const insertProduct = async (req, res, next) => {
    try {
        const product = new productModidy({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.files.map(file => file.filename),
            category: req.body.fruits,
            stock: req.body.stock
        })
        const categoryid = req.body.fruits;
        await categorydata.findOneAndUpdate({ category: categoryid }, { $inc: { products: 1 } })
        await product.save()
        res.redirect('/admin/productlist')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const insertCategory = async (req, res, next) => {
    try {
        const category = req.body.name;
        const product = new categorydata({
            category: category
        })
        const existdata = await categorydata.findOne({ category: category })
        if (existdata != null) {
            req.session.categorymessage = "Your category is already exist"
        } else {
            const categorysave = await product.save()
            if (categorysave) {
                req.session.categorymessage = "category saved sucessfully"
            } else {
                req.session.categorymessage = "error occured on category submition"
            }
        }
        res.redirect('/admin/categorylist')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const productlist = async (req, res, next) => {
    try {
        let products = await productModidy.find()
        res.render('productlist', { products })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const deleteproduct = async (req, res, next) => {

    try {
        const userid = req.body.id
        await productModidy.findOneAndUpdate({ _id: userid }, { $set: { delete: 1 } })
            .then(() => {
                res.json({
                    status: true,
                })
            }).catch((err) => {
                console.log(err)
                res.json({
                    status: false
                })
            })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const undodeleteproduct = async (req, res, next) => {

    try {
        const userid = req.body.id
        console.log(userid)
        await productModidy.findOneAndUpdate({ _id: userid }, { $set: { delete: 0 } })
            .then(() => {
                res.json({
                    status: true,
                })
            }).catch((err) => {
                console.log(err)
                res.json({
                    status: false
                })
            })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadprofile = async (req, res, next) => {
    try {
        res.render('profile')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const categorylist = async (req, res, next) => {
    try {
        alertMessage = req.session.categorymessage
        req.session.categorymessage = ""
        const category = await categorydata.find({})
        res.render('categorylist', { category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.id
        const product = await productModidy.findOne({ _id: productId })
        const category = await categorydata.find({})
        res.render('productEdit', { product, category })
    } catch (error) {
        console.log(error.messaage)
        next(error)
    }
}
const updateProduct = async (req, res, next) => {
    try {

        const name = req.body.name
        const price = req.body.price
        const description = req.body.description
        const category = req.body.fruits
        const stock = req.body.stock
        const id = req.body.product
        const productdata = await productModidy.findOneAndUpdate({ _id: id }, {
            $set: {
                name: name,
                price: price,
                description: description,
                category: category,
                stock: stock
            }
        }).then(() => {
            res.redirect('/admin/productlist')
        }).catch((error) => {
            next(error)
        })


    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadOrderList = async (req, res, next) => {
    try {
        const orders = await orderModel.find({}).populate("user")
        res.render('orderlist', { orders })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const viewOrder = async (req, res, next) => {
    try {
        const OrderId = req.params.id
        const order = await orderModel.findOne({ _id: OrderId }).populate("products.product")
        res.render("order-details", { order })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const listCoupon = async (req, res, next) => {
    try {
        const couponList = await couponModel.find({})
        res.render("coupon-list", { couponList })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
const loadAddCoupon = async (req, res, next) => {
    try {
        res.render("add-coupon")
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const postAddCoupon = async (req, res, next) => {
    try {
        let { name, code, date, amount, quantity } = req.body
        date = parseInt(date)
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + (date * 24 * 60 * 60 * 1000));

        const newCoupon = new couponModel({
            name: name,
            code: code,
            issued_date: currentDate,
            validUpTo: futureDate,
            amount: amount,
            quantity: quantity
        })
        await newCoupon.save().then(() => console.log("coupn entered")); res.redirect("/admin/coupon-list")
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const updateOrder = async (req, res, next) => {
    try {
        const { orderid, name } = req.body
        const Order = await orderModel.findOneAndUpdate({ _id: orderid }, {
            $push: {
                orderstatus: name
            }
        })
        res.json({ status: true, name: name })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const removeImage = async (req, res, next) => {
    try {
        const { id, image } = req.body
        const product = await productModidy.findOne({_id:id})
        if(product.image.length > 1){

            const result = await productModidy.findOneAndUpdate({ _id: id },
                { $pull: { image: image} })
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const addImage = async (req, res, next) => {
    try {
        const { id } = req.body
       
        const result = await productModidy.findOneAndUpdate(
            { _id: id },
            { $push: { image: req.files.map(file => file.filename) } },
            { new: true } // return the updated document instead of the original document
          );
           res.redirect(`/admin/edit-product/${id}`)
        
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadCategoryedit = async(req,res,next)=>{
    try {
        const id = req.params.id
        const categorydetails = await categorydata.findOne({_id:id});
        res.render("edit-category",{categorydetails})
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const updateCategory = async (req,res,next)=>{
    try {
        const category = req.body.id
        const name = req.body.name
        console.log(category,name);
        const detiails = await categorydata.findOneAndUpdate({_id:category},{
            $set:{
                category:name
            }
        })
        console.log(detiails)

        res.redirect("/admin/categorylist")
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const deleteCategory = async(req,res,next)=>{
    try {
        const category = req.body.name
        const detiails = await categorydata.findOneAndUpdate({category:category},{
            $set:{
                delete:1
            }
        })
        console.log(detiails)
        res.json({
            status:true
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const undoCategory = async(req,res,next)=>{
    try {
        const category = req.body.name
        const detiails = await categorydata.findOneAndUpdate({category:category},{
            $set:{
                delete:0
            }
        })
        console.log(detiails)
        res.json({
            status:true
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
module.exports = {
    undoCategory,
    deleteCategory,
    updateCategory,
    loadCategoryedit,
    addImage,
    updateOrder,
    removeImage,

    postAddCoupon,
    loadAddCoupon,
    listCoupon,
    viewOrder,
    loadOrderList,

    updateProduct,
    loadEditProduct,

    loadSignIn,
    loadHome,
    logout,
    postlogin,


    userlist,
    block,
    unblock,

    loadinsertproduct,
    insertProduct,
    productlist,
    deleteproduct,
    undodeleteproduct,

    loadprofile,

    loadcategory,
    insertCategory,
    categorylist

}