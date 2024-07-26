const db_Config = require('../config/DbConfigPractical');
const sql = require('mssql');
class User{
    constructor(user_id,username,passwordHash,role){
        this.user_id = user_id;
        this.username = username;
        this.passwordHash  = passwordHash;
        this.role = role;
    }

    static async getUserByUsername(username){
        const connection = await sql.connect(db_Config)
        const sqlQuery = `SELECT * FROM Users WHERE username = @username`;
        const request = connection.request();
        request.input("username",username);
        const result = await request.query(sqlQuery);
        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new User(row.user_id, row.username, row.passwordHash, row.role);
        }
        return null;
        
    }

    
    static async registerUser(username,passwordHash,role){
        const connection = await sql.connect(db_Config);
        const sqlQuery = `INSERT INTO Users(username,passwordHash,role) VALUES (@username,@passwordHash,@role)`;
        const request = connection.request();
        request.input("username",username);
        request.input("passwordHash",passwordHash);
        request.input("role",role);
        const result = await request.query(sqlQuery);
        return result.rowsAffected > 0;
    }

    static async getAllEvents(){
        
    }
}
module.exports = User;
