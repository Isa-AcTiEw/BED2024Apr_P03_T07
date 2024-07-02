const db_Config = require('../config/DbConfigPractical')

class User{
    constructor(id,username,passwordHash,role){
        this.id = id;
        this.username = username;
        this.passhash = passwordHash;
        this.role = role;
    }

    static async getUserByUsername(username,passhash){
        const connection = await sql.connect(db_Config)
        const sqlQuery = `SELECT * FROM Users WHERE username = @username AND passwordHash = @passwordHash`;
        const request = connection.request();
        request.input("username",username);
        request.input("passwordHash",passwordHash);
        const result = await request.query(sqlQuery);
        // return result.recordset((row) => new User(
        //     row.user_id,
        //     row.username,
        //     row.passwordHash,
        //     row.role

        // ))
        return true;
        
    }

    
    static async registerUser(User){
        const connection = await sql.connect(db_Config);
        const sqlQuery = `INSERT INTO Users(user_id,username,passwordHash,role) VALUES (@user_id,@username,@passwordHash,@role)`;
        const request = connection.request();
        request.input("user_id",User.user_id)
        request.input("username",User.username)
        request.input("passwordHash".User.passwordHash)
        const result = await request.query(sqlQuery);
        const rowsAffected = result.affectedRows
        if(rowsAffected > 0){
           return `Num rows affected ${rowsAffected}`
        }
        else{
            console.log("Unable to insert");
        }
    }
}
module.exports = User;
