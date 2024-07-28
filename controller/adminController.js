const Admin = require("../model/Admin");
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRETKEY;

async function stafflogin(req, res) {
    const { AdminEmail, AdminPassword } = req.body;

    try {
        const staff = await Admin.getAdminByEmail(AdminEmail);
        if (!staff) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(AdminPassword, staff.AdminPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = {
            id: staff.AdminID,
            role: "Staff"
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "36000s" });
        return res.status(200).json({ token });  // Return token as JSON object
    } catch (err) {
        console.error('Error during staff login:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    stafflogin
};