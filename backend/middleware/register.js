const User = require("../models/user");
const jwtUtils = require("../utils/jwtUtils")
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { username,password,email} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            friends:[],
            groups:[],
            chatHistory:[]
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

