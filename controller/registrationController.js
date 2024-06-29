const Registration = require("../model/Registration");

const getAllRegistrations = async (req, res) => {
    try {
        const registration = await Registration.getAllRegistrations();
        res.json(registration);
    } catch(error) {
        console.log(error);
        res.status(500).send("Error retrieving registration");
    }
};

const getRegistrationById = async (req, res) => {
    const registrationId = req.params.id;
    try {
        const registration = await Registration.getRegistrationById(registrationId);
        if (!registration) {
            return res.status(404).send("Registration not found");
        }
        res.json(registration);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving registration")
    }
};

module.exports = {
    getAllRegistrations,
    getRegistrationById
};