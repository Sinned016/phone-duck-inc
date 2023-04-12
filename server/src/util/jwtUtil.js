import jwt from 'jsonwebtoken'; // npm install jsonwebtoken https://github.com/auth0/node-jsonwebtoken#readme
import * as dotenv from "dotenv"
dotenv.config()

const SUPER_SECRET = process.env.SUPER_SECRET;


//Generate jsw token on login
function generate(user) {
  // registered claims (pre defined payload variables)
  let payloadOptions = {
    issuer: "Phone-Duck-inc",
    subject: "send and receive access token",
    expiresIn: "120m" // 120 minutes
  }

  // private claims (custom payload)
  let payload = {
    username: user.username,
    role: user.role
  }

  let token = jwt.sign(payload, SUPER_SECRET, payloadOptions);

  return token;
}


function verify(token) {
    try {
      return jwt.verify(token, SUPER_SECRET); // verify signature and return payload
    } catch (err) {
      let verfError = new Error(); //custom verification error
  
      if (err.name == "JsonWebTokenError") {
        verfError.clientMessage = "Digital signing is invalid, request new token";
        verfError.serverMessage = "Token verification failed";
      }
  
      if (err.name == "TokenExpiredError") {
        verfError.clientMessage = "Digital signing is invalid, request new token";
        verfError.serverMessage = "Token expired";
      }
  
      throw verfError;
    }
}

function getUser(req, res) {
  const authHeader = req.headers['authorization'];
  const authToken = authHeader.replace("Bearer ", "");
  const decoded = jwt.verify(authToken, SUPER_SECRET);

  return decoded;
}

function generateServerToken() {
    let payloadOptions = {
      issuer: "express-server",
      subject: "server-communication",
      expiresIn: "15m", // 15 minutes
    };
  
    let token = jwt.sign({}, SUPER_SECRET, payloadOptions);
  
    return token;
}



export default { generate, verify, getUser, generateServerToken }