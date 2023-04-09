const OrderModel = require('../models/orders')

const searchOrder = async (req, res, next) => {
    try {
        const startOfToday = new Date();
        let todaySum = 0
        let totalSum = 0
        const dateOnly = startOfToday.toISOString().slice(0, 10);
        const todayOrder = await OrderModel.find();
        todayOrder.forEach(element => {
            let date = (element.orderdate).toISOString().slice(0, 10);
            if(element.orderstatus[element.orderstatus.length-1] !="order cancelled"){
                totalSum += element.totalprice
                if (date == dateOnly) {
                    todaySum += element.totalprice
                }
            }
        });
        req.session.todaySales = {
            todaySum: todaySum,
            totalSum: totalSum
        }
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};


module.exports = searchOrder