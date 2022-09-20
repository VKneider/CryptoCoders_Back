 let xlsx = require ('xlsx')

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

      let { email } = p;
      try {
        let client = await connectDB()
        const colUsers = client.db().collection('users');
        let user = await colUsers.find({ email }).toArray();
     
           var wb = new xlsx.utils.book_new();
           wb.props = {
     
               Title:`${user[0].email}´s payments`,
               Subject: 'Payments',
               Author: user[0].email,
               CreatedDate: Date.now()
           }
     
           wb.SheetNames.push('payments');
     
           let i=0;
           let paymentsLen = user[0].payments.length;
     
           let arr = []
           for (;i<paymentsLen;i++){
     
               if(user[0].payments[i].quantity>0){
     
                   arr.push([user[0].payments[i].token,user[0].payments[i].quantity, user[0].payments[i].other, user[0].email,user[0].payments[i].date])
               } else {
                   arr.push([user[0].payments[i].token,user[0].payments[i].quantity, user[0].email, user[0].payments[i].other,user[0].payments[i].date])
               }
     
           }
     
           var ws_data = [['coin', 'quantity', 'sender', 'receiver', 'export.payment'] ]
           let j=0;
           for(;j<arr.length;j++){
               ws_data.push(arr[j])
           }
     
           var ws = xlsx.utils.aoa_to_sheet(ws_data)
           wb.Sheets['payments'] = ws;
     
           xlsx.writeFile(wb, "test.xlsx")
           
           
          } catch (error) {console.log(error);}

}

}