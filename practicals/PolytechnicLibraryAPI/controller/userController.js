const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const User = require('../model/User');
require('dotenv').config();
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
      const existingUser = await User.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user in database
      const pool = await sql.connect(dbConfig);
      await pool.request()
        .input('username', username)
        .input('passwordHash', hashedPassword)
        .input('role', role)
        .query('INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)');
  
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
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const payload = {
          id: user.id,
          role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour

        return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, login };
