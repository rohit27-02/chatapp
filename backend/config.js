const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    secretKey: process.env.SECRET_KEY, // Change this to a secure secret key
};
