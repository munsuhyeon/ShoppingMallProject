const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET  = process.env.JWT_SECRET;

const generateAccessToken = (payload) => {
    const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:'1h'});
    return token;
};
const generateRefreshToken = (payload) => {
    const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}

module.exports = {generateAccessToken, generateRefreshToken};