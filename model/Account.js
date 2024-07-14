const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Account {
    constructor(AccID,AccName,AccEmail,AccCtcNo,AccDOB,AccAddr){
        this.AccID = AccID;
        this.AccName = AccName;
        this.AccEmail = AccEmail;
        this.AccCtcNo = AccCtcNo;
        this.AccDOB = AccDOB;
        this.AccAddr = AccAddr;
    }
    
    static async getAccountByEmail(email){
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `SELECT * FROM Account WHERE AccEmail = @email`;
        const request = connection.request();
        request.input("email", email);
        const result = await request.query(sqlQuery);

        return result.recordset[0]
			? new Account(
				result.recordset[0].AccID,
				result.recordset[0].AccName,
				result.recordset[0].AccEmail,
                result.recordset[0].AccCtcNo,
                result.recordset[0].AccDOB,
                result.recordset[0].AccAddr
			)
			: null;

        // if (result.recordset.length > 0) {
        //     const row = result.recordset[0];
        //     return new Account(row.AccID, row.AccName, row.AccCtcNo, row.AccEmailAddr, row.AccAddr, row.AccDOB);
        // }
        // return null;
        
    }
}
module.exports = Account;