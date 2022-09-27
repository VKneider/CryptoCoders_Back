let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');
const nodeMailer = require("nodemailer");


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
          
          let userReceiver = await colUsers.find({ email:receiver }).toArray();
          if (userReceiver.length == 0) { return output(0) } 
          
          
          let userSender = await colUsers.find({ email:sender }).toArray();
          let userSenderData = userSender[0];

          if(userSenderData.balance[token] < quantity){return output(1)}
         
          if(sender==receiver){return output(2)}


          const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: 'cryptocoders2022@gmail.com',
                pass: 'hxqsxpqacpgxsimu',
            },
            });
            
            
            const accountVerOpt = (user, verLink) => {
                
                return {
                    from: "CryptoCoders",
                    to: user,
                    bbc: "cryptocoders2022@gmail.com",
                    subject: `cryptoCoders - Authorization code`,
                    html: `<h2>Your authorization code is ${verLink} </h2>`,
                };
                };
                
                
    
    
          
            
    
            let keys = Object.keys(userSenderData.verCode).length;
            let rs = Number(Math.random().toString(10).slice(-6))
            let obj = {time:Date.now(), code: rs}
            
            if(keys==0){
               
             await colUsers.updateOne({ email:sender }, {$set:{verCode:obj}});
             transporter.sendMail(accountVerOpt(sender, rs));

             return output(3)
            }

            if(Date.now() < userSenderData.verCode.time + 3 * 60000 ){ transporter.sendMail(accountVerOpt(sender, userSenderData.verCode.code)); return output(4) }
    
             
             await colUsers.updateOne({ email:sender }, {$set:{verCode:obj}});
             transporter.sendMail(accountVerOpt(sender, rs));

             return output(5)



      } catch (error) {console.log(error);}
   }
}