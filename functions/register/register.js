const connectDB = require("../connectDB/connectDB");
const { output } = require("../../utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");



exports.handler = async (event) => {
  let { httpMethod: method, queryStringParameters: p } = event;

  let client = await connectDB();
  const colUsers = client.db().collection("users");

  if (method == "OPTIONS") {
    return output("hola");
  }

  if (method == "POST") {
    try {

        let {email}=p
      let userData = await colUsers.find({ email }).toArray();
      
      
      if (userData.length == 0) {


            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(p.password, salt);

            let secretToken = await bcrypt.hash(p.email, salt);

            const userToken = jwt.sign(
                {
                    email: p.email,
                    password: p.password,
                },
                "CryptoCoders",
                { expiresIn: "1h" }
                );

                
                
             await colUsers.insertOne({
            email: p.email,
            names: p.names,
            lastnames: p.lastnames,
            address: p.address,
            password: hash,
            verify: false,
            verToken: userToken,
            balance: {usdt:0, busd:0, btc:0, eth:0},
            payments:[],
            deposits:[],
            secretToken:secretToken,
            verCode:{}
            });

            

            const transporter = nodeMailer.createTransport({
            service: "gmail",
            port:465,
            
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
                  subject: `Confirmacion de tu cuenta de CrytoCoders`,
                  html: `<h2>Para poder activar la cuenta por favor ingresa en el siguiente link <a href=${verLink}>Activar cuenta</a></h2>`,
              };
              };

            const verLink = `http://localhost:8888/verifyEmail/${userToken}/`;

            transporter.sendMail(accountVerOpt(p, verLink));
            console.log(transporter)
            
            return output(1)

      } else {//está registrado
      
        var expiredFlag=false;
        try {
            let decoded = jwt.verify(userData[0].verToken,"CryptoCoders")
            
        } catch (error) {
            
            expiredFlag=true
        }
        
       
        
        if (userData[0].verify == false) {// registrado, pero no verificó el correo

                if(expiredFlag==true){ // registrado, pero no verificó el correo y el token se venció (ya pasó 1h)

                    let salt = await bcrypt.genSalt(10);
                    let hash = await bcrypt.hash(p.password, salt);
                    let secretToken = await bcrypt.hash(p.email, salt);
        
                    const userToken = jwt.sign(
                    {
                        email: p.email,
                        password: p.password,
                    },
                    "CryptoCoders",
                    { expiresIn: "1h" }
                    );

                   
        

                     await colUsers.updateOne({email:p.email},{$set:
                    {names: p.names,
                    lastnames: p.lastnames,
                    address: p.address,
                    password: hash,
                    verify: false,
                    verToken: userToken,
                    balance: {usdt:0, busd:0, btc:0, eth:0, doge:0},
                    payments:[],
                    deposits:[],
                    secretToken:secretToken,
                    verCode:{}
                    }});
        
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
                            subject: `Confirmacion de tu cuenta de CrytoCoders`,
                            html: `<h2>Para poder activar la cuenta por favor ingresa en el siguiente link <a href=${verLink}>Activar cuenta</a></h2>`,
                        };
                        };
          
                      const verLink = `http://localhost:8888/verifyEmail/${userToken}/`;
          
                      transporter.sendMail(accountVerOpt(p, verLink));
                    
                    return output(2)

                } else {

                    
                    return output(3)
                }
            
                

        } else {
            
            return output(4)
        }

        
      }
    } catch (error) {
      console.log(error);
    }
  }
};
