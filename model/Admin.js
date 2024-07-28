const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Admin {
    constructor(AdminID, AdminEmail, AdminPassword) {
        this.AdminID = AdminID;
        this.AdminEmail = AdminEmail;
        this.AdminPassword = AdminPassword;
    }

    static async getAdminByEmail(email) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Admin WHERE AdminEmail = @email`;
        const request = connection.request();
		request.input("email", email);
		const result = await request.query(sqlQuery);

		if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Admin(row.AdminID, row.AdminEmail, row.AdminPassword);
        }
        return null;
    }
}
module.exports = Admin;