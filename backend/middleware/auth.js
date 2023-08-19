const jwtUtils = require("../Utils/jwtUtils")
const User = require("../models/user");

const checkRole = (role) => {
    return async (req, res, next) => {
        const token = jwtUtils.extractTokenFromRequest(req);
        console.log(token);

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const decoded = jwtUtils.verifyToken(token);
            const user = await User.findById(decoded.userId);

            if (!user || user.role !== role) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.log(error)
            res.status(401).json({ error: 'unauthorized' });
        }
    };
};

module.exports = checkRole;