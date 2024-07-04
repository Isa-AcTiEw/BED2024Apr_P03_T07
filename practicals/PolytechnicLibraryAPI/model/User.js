const db_Config = require('../config/DbConfigPractical')

class User{
    constructor(user_id,username,passwordHash,role){
        this.user_id = user_id;
        this.username = username;
        this.passwordHash  = passwordHash;
        this.role = role;
    }

    static async getUserByUsername(username,passwordHash){
        const connection = await sql.connect(db_Config)
        const sqlQuery = `SELECT * FROM Users WHERE username = @username AND passwordHash = @passwordHash`;
        const request = connection.request();
        request.input("username",username);
        request.input("passwordHash",passwordHash);
        const result = await request.query(sqlQuery);
        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new User(row.user_id, row.username, row.passwordHash, row.role);
        }
        return null;
        
    }

    
    static async registerUser(user){
        const connection = await sql.connect(db_Config);
        const sqlQuery = `INSERT INTO Users(user_id,username,passwordHash,role) VALUES (@user_id,@username,@passwordHash,@role)`;
        const request = connection.request();
        request.input("user_id",user.user_id)
        request.input("username",user.username)
        request.input("passwordHash".user.passwordHash)
        request.input("role", user.role);
        const result = await request.query(sqlQuery);
        return result.rowsAffected > 0;
    }
}
module.exports = User;
