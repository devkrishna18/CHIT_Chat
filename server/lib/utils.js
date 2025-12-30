const jwt = require("jsonwebtoken");
exports.generateToken=(payload)=>{
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return token;
}