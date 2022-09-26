let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');
const nodeMailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars')
const path = require ('path')

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
            
            


      let { email } = p;
      try {

        let user = await colUsers.find({ email }).toArray();
        let userData = user [0]


        if(Date.now() < userData.verCode.time + 3 * 60000 ){ return output(0) }

         let rs = Math.random().toString(10).slice(-6)
         let obj = {time:Date.now(), code: rs}
         await colUsers.updateOne({ email }, {$set:{verCode:obj}});
         transporter.sendMail(accountVerOpt(user[0], rs));
         

         return output(1)

      } catch (error) {console.log(error);}
   }
}

