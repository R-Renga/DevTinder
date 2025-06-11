const express = require("express");
const { authCheck } = require("../middleware/auth");
const premiumRouter = express.Router();
const razorPayInstance = require("../utilis/razorpay")
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utilis/constant");
const User = require("../models/user");

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
});

premiumRouter.post("/payment/webhook",async (req,res)=>{
   try {
      const webHookSignature = req.get("X-Razorpay-Signature");

      const webHookValid = validateWebhookSignature(
         JSON.stringify(req.body),
         webHookSignature,
         "RengaTinder@123"
      )

      if(!webHookValid){
         return res.status(400).send("webhook is not valid")
      }

      const paymentDetails = req.body.payload.payment.entity;

      const payment = await Payment.findOne({orderId : paymentDetails.order_id})
      payment.status = paymentDetails.status;

      await payment.save()

      const user = await User.findOne({_id:payment.userId});
      user.premium = true;
      user.memberShipType = payment.notes.membershipType;
      await user.save();

      if(req.body.event === "payment.captured"){

      }
      if(req.body.event === "payment.failure"){

      }

      return res.status(200).send("webhook saved successfully")
   } catch (error) {
      console.log(error);
      res.status(500).send(error)
   }
})


premiumRouter.get("/payment/verify",authCheck,async(req,res)=>{
   const user = req.user.toJSON()
   if(user.premium){
      return res.status(200).json({premium:true})
   }else{
      return res.status(200).json({premium:false})  
   }
})

module.exports = premiumRouter;