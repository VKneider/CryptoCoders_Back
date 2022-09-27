const { output } = require("../../utils");
let connectDB = require('../connectDB/connectDB');
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;




    if (method == "OPTIONS"){
        return output('hola')
     }




     if (method == "GET"){
        
        let client = await connectDB()
        const colUsers = client.db().collection('users');


        let {token} = p;
        
        
        var expiredFlag=false;

        try {
            let decoded = jwt.verify(token,"CryptoCoders")
            return output(1)

        } catch (error) {
            
            expiredFlag=true
            return output(0)
        }


         
            
            
     }

    
    

    }