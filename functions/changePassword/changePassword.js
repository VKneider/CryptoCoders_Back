let { output } = require('../../utils');
let connectDB = require('../connectDB/connectDB');
const bcrypt = require("bcrypt");

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

       try {
           
        let { email,oldPassword, newPassword } = p;
        let user = await colUsers.find({ email }).toArray();
        let data =  bcrypt.compare(oldPassword, user[0].password)

         
         if (data){

            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(newPassword, salt);
            await colUsers.updateOne({ email }, {$set:{password:hash}});
            return output(1)

         } else { return output(0)}
        

         

      } catch (error) {console.log(error);}
   }
}