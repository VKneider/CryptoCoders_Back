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
      console.log(p)
      let { sender,receiver, quantity, token, email, code} = p;
      

      try {
          
         let user = await colUsers.find({ email }).toArray();
         let userData=user[0]

          let userReceiver = await colUsers.find({ email:receiver }).toArray();
          let userReceiverData = userReceiver[0];
          
          let userSender = await colUsers.find({ email:sender }).toArray();
          let userSenderData = userSender[0];

          
          if(Date.now() > userData.verCode.time + 3 * 60000 ){ return output(0) }

          if (code == userData.verCode.code){


             userReceiverData.balance[token]+=Number(quantity)
             userSenderData.balance[token]-=Number(quantity)
     
              let receiverTransfer = {quantity:Number(quantity) , token: token, other: sender, date:Date.now()}
              let senderTransfer = {quantity:-Number(quantity), token:token, other:receiver, date:Date.now()}
     
              userSenderData.payments.push(senderTransfer)
              userReceiverData.payments.push(receiverTransfer)   
     
             
             await colUsers.updateOne({email:receiver},{$set:{ balance:userReceiverData.balance, payments:userReceiverData.payments }})
             await colUsers.updateOne({email:sender},{$set:{ balance:userSenderData.balance, payments:userSenderData.payments }})
             
     
             
             return output(2)
          } else {

            return output(1)
          }
          

      } catch (error) {console.log(error);}
   }
}
