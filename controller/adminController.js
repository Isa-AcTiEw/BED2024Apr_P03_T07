const Admin = require("../model/Admin");

const getAdminById = async (req, res) => {
    const adminId = req.params.id;
    try {
        const admin = await Admin.getAdminById(adminId);
        if (!admin) {
            return res.status(404).send("Admin not found");
        }
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving admin")
    }
};

module.exports = {
    getAdminById
};