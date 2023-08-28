const User = require("../models/user");

const getFriendsList = async(req,res)=>{
    try {
        const users = await User.find().exec();
        res.status(200).json({users:users});
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}


module.exports = {getFriendsList};