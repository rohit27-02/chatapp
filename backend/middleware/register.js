const User = require("../models/user");
const jwtUtils = require("../utils/jwtUtils")
const bcrypt = require("bcrypt");
const uuid = require('uuid');

const register = async (req, res) => {
    const { username,password,email} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            socketid: uuid.v4()
            
        });
        await user.save();

        const token = jwtUtils.generateToken(user._id, user.role);
        res.status(201).json({ message: "User created successfully", token: token,username:username })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "An error occurred" });

    }

}

module.exports = register;

