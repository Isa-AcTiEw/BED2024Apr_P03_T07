const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Admin {
    constructor(AdminID, AdminName, AdminPass) {
        this.AdminID = AdminID;
        this.AdminName = AdminName;
        this.AdminPass = AdminPass;
    }

    static async getAdminById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Admin WHERE AdminID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset[0]
			? new Admin(
				result.recordset[0].AdminID,
				result.recordset[0].AdminName,
				result.recordset[0].AdminPass,
			)
			: null;
    }
}
module.exports = Admin;