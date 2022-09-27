const { output } = require("../../utils");
let connectDB = require('../connectDB/connectDB');
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");

exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;




    if (method == "OPTIONS"){
        return output('hola')
     }




     if (method == "POST"){
        
        let client = await connectDB()
        const colUsers = client.db().collection('users');


        let { email} = p;
        let user = await colUsers.find({ email}).toArray();
        
        if(user.length==0){return output(0)}
        
        if(user[0].verify==false){return output(1)}


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
                    to: email,
                    bbc: "cryptocoders2022@gmail.com",
                    subject: `cryptoCoders - Forgot Password Authorization`,
                    html: `<h2>Open the next link to change your password: <a href="${verLink}"> Click Here </a>  </h2>`,
                };
                };
                
                const userToken = jwt.sign(
                    {
                        email: email,
                    },
                    "CryptoCoders",
                    { expiresIn: "5m" }
                    );
    
                    const verLink = `https://cryptocoders-pi.vercel.app/ForgotPassword/${userToken}`;
                    



                transporter.sendMail(accountVerOpt(email, verLink));
                return output(2)
        
            
     }

    
    

    }

