const { subDays,startOfDay,endOfDay} = require("date-fns");
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");

cron.schedule('32 11 * * *', async () => {
   try {
    const yesterday = subDays(new Date(),1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
        status : "interested",
        createdAt:{
            $gte:yesterdayStart,
            $lt:yesterdayEnd
        }
    }).populate("fromUserId toUserId");

const listOfEmails = [...new Set(pendingRequest.map(req => req.toUserId.emailID))]

for(const emails of listOfEmails){
    console.log(emails)
}

   } catch (error) {
    console.log(error)
   }
  });