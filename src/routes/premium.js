const express = require("express");
const { authCheck } = require("../middleware/auth");
const premiumRouter = express.Router();
const razorPayInstance = require("../utilis/razorpay")
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utilis/constant");

premiumRouter.post("/payment/createOrder",authCheck,async (req,res)=>{
 try {

    const membershipTypes = req.body.membershipType
    const {firstName,lastName,emailID} = req.user
       const orders = await razorPayInstance.orders.create({
        amount:memberShipAmount[membershipTypes],
        currency:"INR",
        receipt:"receipt#1",
        notes:{
            firstName,
            lastName,
            emailID,
            membershipType:membershipTypes
        }
       });

       const payment = new Payment({
        userId: req.user._id,
        amount : orders.amount,
        orderId:orders.id,
        status:orders.status,
        currency:orders.currency,
        recipt:orders.receipt,
        notes:orders.notes
       })

       const paymentSave = await payment.save()

       res.json({...paymentSave.toJSON()})
 } catch (error) {
    console.log(error);
    res.status(400).send(error)
 }
})

module.exports = premiumRouter;