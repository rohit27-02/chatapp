const User = require("../models/user");
const jwtUtils = require("../Utils/jwtUtils");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { username,password,role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            role
        });
        await user.save();

        const token = jwtUtils.generateToken(user._id, role);
        res.status(201).json({ message: "User created successfully", token: token })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "An error occurred" });

    }

}

module.exports = register;

