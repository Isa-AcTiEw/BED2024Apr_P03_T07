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

const createFacility = async (req, res) => {
    const newFacility = req.body;
    try {
        const createdFacility = await Facilities.createFacility(newFacility);
        res.status(201).json(createdFacility);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating facility");
    }
};

const updateFacility = async (req, res) => {
    const newFacility = req.body;
    const id = req.params.id
    try {
        const updatedFacility = await Facilities.updateFacility(id, newFacility);
        if (!updatedFacility) {
            return res.status(404).send("Facility not found");
        }
        res.json(updatedFacility);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating facility");
    }
};

const deleteFacility = async (req, res) => {
    const id = req.params.id;
    try {
        const success = await Facilities.deleteFacility(id);
        if (!success) {
            return res.status(404).send("Facility not found")
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting facility");
    }
};

module.exports = {
    getAllFacilities,
	getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility
};