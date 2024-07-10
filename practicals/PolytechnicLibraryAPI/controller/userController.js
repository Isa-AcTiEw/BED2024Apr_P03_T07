const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const User = require('../model/User');
require('dotenv').config({ path: '../.env' });
const secretKey = process.env.ACCESS_TOKEN_SECRET;

async function registerUser(req, res) {
    const { username, password, role } = req.body;
  
    // Validation logic 
    // if empty
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Username, password, and role are required" });
    }

    // if role input is not member/librarian
    if (role !== "member" && role !== "librarian") {
      return res.status(400).json({ message: "Invalid role" });
    }
  
    try {
      // Check for existing username
      const existingUser = await User.getUserByUsername(username,password);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user in database
      const createdUser = User.registerUser(username,hashedPassword,role);
      return res.status(201).json({ message: "User created successfully" });
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Validate user credentials
        const user = await User.getUserByUsername(username);
        // use keyword await as getUserByUsername is an async function
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        // if the hashed passowrd from db does not match the becryot hashed password return a json message Invalid password
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token, payload refers to data and information we would like to store inside the user's token
        const payload = {
          id: user.id,
          role: user.role,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "3600s" }); // Expires in 1 hour (automaticallt logsout user after the session of 1 hour exceeded)
        return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};
// export the two modules from the userController.js (Login and registerUser)

module.exports = { registerUser, login };
