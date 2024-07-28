const Account = require("../model/Account");
const bcrypt = require('bcrypt');
const sql = require('mssql');
require('dotenv').config();  
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRETKEY;

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
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(AccPassword, user.AccPassword);
        // if the hashed passowrd from db does not match the bcryot hashed password return a json message Invalid password
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token, payload refers to data and information we would like to store inside the user's token
        const AccID = user["AccID"];
        // // Extract ACC , ADM , EVT and FAL
        const accountType = AccID.substring(0,3)

        if(accountType == "ACC"){
            const payload = {
                id: AccID,
                role: "Member"
              };
              const token = jwt.sign(payload,secretKey ,{expiresIn: "36000s"})
              return res.status(200).json(token)
        }

        else if(accountType == "EVT"){
            const payload = {
                id:AccID,
                role: "Event Manager"
            }
            const token = jwt.sign(payload,secretKey ,{expiresIn: "36000s"})
            return res.status(200).json(token)
        }

        else if (accountType == "FAL"){
            const payload = {
                id:AccID,
                role: "Facilities Manager"
            }
            const token = jwt.sign(payload,secretKey ,{expiresIn: "36000s"})
            return res.status(200).json(token)
        }

        else if (accountType == "ADM"){
            const payload = {
                id:AccID,
                role: "Admin"
            }
            const token = jwt.sign(payload,secretKey ,{expiresIn: "36000s"})
            return res.status(200).json(token)
        }
        
        else{
            return res.status(404).send("Unable to generate token for unknown user")
        }
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

// got error here 
async function verifyToken(req, res, next) {
    // Extract the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({token:token });
    }

    jwt.verify(token, secretKey, (error, decoded) =>{
        if(error){
            return res.status(401).json({message:"There is no token"})
        }
        else{
            return res.status(200).json({message: "Token payload decoded" , value:decoded})
        }
    })
}

module.exports = {
    login,
    getAccountByEmail,
    registerAccount,
    verifyToken,
    updateAccount,
}