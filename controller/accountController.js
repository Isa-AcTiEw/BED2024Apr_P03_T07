const Account = require("../model/Account");
const bcrypt = require('bcrypt');
const sql = require('mssql');
require('dotenv').config({ path: '../.env' });

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

module.exports = {
    getAccountByEmail,
    registerAccount,
};