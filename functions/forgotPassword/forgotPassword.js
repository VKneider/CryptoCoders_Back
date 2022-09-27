let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

      let { email, newPassword, token } = p;
      
      

      try {
          let decoded = jwt.verify(token,"CryptoCoders")
          let salt = await bcrypt.genSalt(10);
          let hash = await bcrypt.hash(newPassword, salt);
          let user = decoded['email']
          
          await colUsers.updateOne({ email:user }, {$set:{password:hash}});
          return output(1);
          

      } catch (error) {
          
         console.log(error)
         return output(0)
      }

      
   }
}