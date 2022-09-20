let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');


exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   
   let client = await connectDB()
   const colUsers = client.db().collection('users');
  
   if (method == "OPTIONS"){
      return output('hola')
   }

   if (method == "POST"  ) {

      let { sender,receiver, quantity, token} = p;
      

      try {
          
          let userReceiver = await colUsers.find({ secretToken:receiver }).toArray();
          if (userReceiver.length == 0) { return output(0) } 
          let userReceiverData = userReceiver[0];
          
          let userSender = await colUsers.find({ secretToken:sender }).toArray();
          let userSenderData = userSender[0];

          if(userSenderData.balance[token] < quantity){return output(1)}
         
          if(sender==receiver){return output(2)}

        userReceiverData.balance[token]+=Number(quantity)
        userSenderData.balance[token]-=Number(quantity)

         let receiverTransfer = {quantity:Number(quantity) , token: token, other: sender, }
         let senderTransfer = {quantity:-Number(quantity), token:token, other:receiver, }

         userSenderData.payments.push(senderTransfer)
         userReceiverData.payments.push(receiverTransfer)   

        
        await colUsers.updateOne({secretToken:receiver},{$set:{ balance:userReceiverData.balance, payments:userReceiverData.payments }})
        await colUsers.updateOne({secretToken:sender},{$set:{ balance:userSenderData.balance, payments:userSenderData.payments }})
        

        
        return output(3)
      } catch (error) {console.log(error);}
   }
}