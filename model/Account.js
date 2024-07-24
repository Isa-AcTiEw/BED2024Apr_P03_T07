const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Account {
    constructor(AccID,AccName,AccEmail,AccCtcNo,AccAddr,AccPostalCode,AccDOB,AccPassword){
        this.AccID = AccID;
        this.AccName = AccName;
        this.AccEmail = AccEmail;
        this.AccCtcNo = AccCtcNo;
        this.AccAddr = AccAddr;
        this.AccPostalCode = AccPostalCode
        this.AccDOB = AccDOB;
        this.AccPassword = AccPassword;
    }
    
    static async getAccountByEmail(email){
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `SELECT * FROM Account WHERE AccEmail = @email`;
        const request = connection.request();
        request.input("email", email);
        const result = await request.query(sqlQuery);

        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Account(row.AccID, row.AccName, row.AccEmail, row.AccCtcNo, row.AccAddr, row.AccPostalCode, row.AccDOB, row.AccPassword);
        }
        return null;
    }

    static async registerAccount(AccName,AccEmail,AccCtcNo,AccAddr,AccPostalCode,AccDOB,AccPassword){
        const randomNum = Math.floor(100 + Math.random() * 900);
        const AccID = `ACC${randomNum.toString().padStart(3, '0')}`;
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Account(AccID,AccName,AccEmail,AccCtcNo,AccAddr,AccPostalCode,AccDOB,AccPassword) 
                         VALUES (@AccID,@AccName,@AccEmail,@AccCtcNo,@AccAddr,@AccPostalCode,@AccDOB,@AccPassword)`;
        const request = connection.request();
        request.input("AccID", AccID);
        request.input("AccName",AccName);
        request.input("AccEmail",AccEmail);
        request.input("AccCtcNo",AccCtcNo);
        request.input("AccAddr",AccAddr);
        request.input("AccPostalCode",AccPostalCode);
        request.input("AccDOB",AccDOB);
        request.input("AccPassword",AccPassword);
        const result = await request.query(sqlQuery);
        return result.rowsAffected > 0;
    }

    static async updateAccount(AccID, newAccData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Account SET AccName = @AccName, AccEmail = @AccEmail, AccCtcNo = @AccCtcNo,
        AccPostalCode = @AccPostalCode, AccDOB = @AccDOB, AccPassword = @AccPassword WHERE AccID = @AccID`;
        const request = connection.request();
        request.input("AccID", AccID);
        request.input("AccName", newAccData.AccName || null);        
        request.input("AccEmail", newAccData.AccEmail || null);
        request.input("AccCtcNo", newAccData.AccCtcNo || null);
        request.input("AccPostalCode", newAccData.AccPostalCode || null);
        request.input("AccDOB", newAccData.AccDOB || null);
        request.input("AccPassword", newAccData.AccPassword || null);
        await request.query(sqlQuery);
        connection.close();
        return this.getAccountByEmail(AccEmail);
    }

}
module.exports = Account;