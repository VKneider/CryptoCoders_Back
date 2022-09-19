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

   if (method == "GET"  ) {

      let { email, code} = p;
      try {

        let user = await colUsers.find({ email }).toArray();
        let userData = user [0]

        if(Date.now() > userData.verCode.time + 5 * 60000 ){ return output(0) }

        if (code == userData.verCode.code){return output(1)} else { return output(2)}
        

      } catch (error) {console.log(error);}
   }
}