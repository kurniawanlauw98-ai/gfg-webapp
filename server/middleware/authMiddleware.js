const jwt = require('jsonwebtoken');
const { getRows } = require('../config/googleSheets');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Special Admin Case
            if (decoded.id === 'ADMIN_001') {
                req.user = { id: 'ADMIN_001', name: 'Super Admin', email: 'admingfg@gfg.org', role: 'admin' };
                return next();
            }

            // Find user in Sheet
            const rows = await getRows('Users');
            const userRow = rows.find(r => r.ID === decoded.id);

            if (!userRow) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = {
                id: userRow.ID,
                name: userRow.Name,
                email: userRow.Email,
                role: userRow.Role || 'user',
                points: parseInt(userRow.Points) || 0
            };

            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };
