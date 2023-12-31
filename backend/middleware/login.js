const User = require("../models/user");
const jwtUtils = require("../utils/jwtUtils")
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwtUtils.generateToken(user._id, user.role);
            return res.json({ message: 'Login successful', token: token ,username:username});
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        return res.status(500).json({ error: "An error occurred" });
    }

}

module.exports = login;

