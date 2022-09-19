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


    const transporter = nodeMailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: 'cryptocoders2022@gmail.com',
            pass: 'hxqsxpqacpgxsimu',
        },
        });


      let { email } = p;
      try {

        let user = await colUsers.find({ email }).toArray();
        let userData = user [0]


        if(Date.now() < userData.verCode.time + 5 * 60000 ){ return output(0) }

         let rs = Math.random().toString(10).slice(-6)
         let obj = {time:Date.now(), code: rs}
         await colUsers.updateOne({ email }, {$set:{verCode:obj}});

         const accountVerOpt = (user, verLink) => {
            let { email, names } = user;
            return {
                from: "CryptoCoders",
                to: email,
                bbc: "cryptocoders2022@gmail.com",
                subject: `Confirmacion de tu cuenta de CrytoCoders`,
                html: `<h2>Código de verificación válido por los próximos 5 minutos: ${rs} </h2>`,
            };
            };

            transporter.sendMail(accountVerOpt(user[0]));
         return output(1)

      } catch (error) {console.log(error);}
   }
}