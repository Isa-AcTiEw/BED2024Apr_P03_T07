const Account = require("../model/Account");
const bcrypt = require('bcrypt');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const secretKey = process.env.ACCESS_TOKEN_SECRET;

async function registerAccount(req, res) {
    const { AccName,AccEmail,AccCtcNo,AccAddr,AccPostalCode,AccDOB,AccPassword } = req.body;

    if (!AccName || !AccEmail || !AccCtcNo || !AccAddr || !AccPostalCode|| !AccDOB || !AccPassword) {
        return res.status(400).json({ message: "Check whether all neccessary fields are filled" });
    }

    try {
      // Check for existing email
      const existingUser = await Account.getAccountByEmail(AccEmail);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(AccPassword, salt);
  
      // Create user in database
      await Account.registerAccount(AccName, AccEmail, AccCtcNo, AccAddr, AccPostalCode, AccDOB, hashedPassword);
      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { AccEmail, AccPassword } = req.body;

    try {
        const user = await Account.getAccountByEmail(AccEmail);
        if (!user) {
          return res.status(401).json({ message: "User not registered" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(AccPassword, user.AccPassword);
        // if the hashed passowrd from db does not match the bcryot hashed password return a json message Invalid password
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token, payload refers to data and information we would like to store inside the user's token
        const payload = {
          id: user.AccID,
          // role not created ?? role: user.role, 
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1800s" }); // Expires in 30min (automatically logsout user after 30min is up)
        return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

const getAccountByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const account = await Account.getAccountByEmail(email);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving account")
    }
};

const updateAccount = async (req, res) => {
    const AccEmail = req.params.email;
    const newAccData = req.body;
    try {
        const updatedAcc = await Account.updateAccount(AccEmail, newAccData);
        if (!updatedAcc) {
            return res.status(404).json("Account not found");
        } 
        res.json(updatedAcc);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating Account information");
    }
};

async function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.decoded = decoded;
        next();
    });
};

module.exports = {
    login,
    getAccountByEmail,
    registerAccount,
    verifyToken,
    updateAccount,
}