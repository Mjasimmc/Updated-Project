const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    issued_date:{
        type:Date,
        required:true
    },
    validUpTo:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    users:[
        {
            type:String
        }
    ]
    
})
module.exports = mongoose.model('coupon',couponSchema);