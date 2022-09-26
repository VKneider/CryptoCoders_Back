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
                let { email } = user;
                return {
                    from: "CryptoCoders",
                    to: email,
                    bbc: "cryptocoders2022@gmail.com",
                    subject: `cryptoCoders - Authorization code`,
                    html: `<h2>Your authorization code is ${verLink} </h2>`,
                };
                };
                
                
    
    
          
            let userData = user [0]
    
    
            if(Date.now() < userData.verCode.time + 3 * 60000 ){ return output(3) }
    
             let rs = Math.random().toString(10).slice(-6)
             let obj = {time:Date.now(), code: rs}
             await colUsers.updateOne({ email }, {$set:{verCode:obj}});
             transporter.sendMail(accountVerOpt(user[0], rs));

             return output(4)



      } catch (error) {console.log(error);}
   }
}