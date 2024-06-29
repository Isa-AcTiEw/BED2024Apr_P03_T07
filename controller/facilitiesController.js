const Facilities = require("../model/Facilities");

const getAllFacilities = async (req, res) => {
    try {
		const facilities = await Facilities.getAllFacilities();
		res.json(facilities);
    } catch (error) {
		console.error(error);
		res.status(500).send("Error retrieving Facilities");
    }
};

const getFacilityById = async (req, res) => {
    const facilityId = req.params.id;
    try {
        const facility = await Facilities.getFacilityById(facilityId);
        if (!facility) {
            return res.status(404).send("Facility not found");
        }
        res.json(facility);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving facility")
    }
};

module.exports = {
    getAllFacilities,
	getFacilityById
};