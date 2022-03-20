const env = require('dotenv').config();

const authValidateJWT = (req, res, next) => {
    const jwt = req.headers["authorization"];
    const jwtService = require("jsonwebtoken");
    jwtService.verify(jwt, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) {
            res.status(403).end();
            return;
        }
        req.userInfo = userInfo;
        next();
    });
  };

module.exports = authValidateJWT;