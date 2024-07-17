const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Account = require("../model/Account");
const Admin = require("../model/Admin");

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const account = await Account.getAccountByEmail(email);
            if (!account) {
            return res.status(401).json({ message: "Invalid credentials" });
            }

        if (account.AccID.includes("ADM","EVT","FAL")){
            return res.json({ message: "Logged in as Admin" });
        } else {
            const isMatch = await bcrypt.compare(password, account.AccPassword);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const payload = {
            id: account.AccID
            };
            const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

            return res.status(200).json({ token });
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    login
};