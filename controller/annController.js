const Announcement = require('../model/Announcement');

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.getAllAnnouncements();
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving announcements");
    }
};

const getAnnouncementById = async (req, res) => {
    const announcementId = req.params.id;
    try {
        const announcement = await Announcement.getAnnouncementById(announcementId);
        if (!announcement) {
            return res.status(404).send("Announcement not found");
        }
        res.json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving announcement")
    }
};

const createAnnouncement = async (req, res) => {
    const newAnn = req.body;
    try {
      const createdAnn = await Announcement.createAnnouncement(newAnn);
      res.status(201).json(createdAnn);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating announcement");
    }
};

const updateAnnouncement = async (req, res) => {
    const AnnID = req.params.id;
    const { AnnName, AnnDesc } = req.body;
    try {
        const updatedAnnouncement = await Announcement.updateAnnouncement(AnnID, AnnName, AnnDesc);
        if (updatedAnnouncement) {
            res.status(200).json(updatedAnnouncement); // Ensure proper response status and data
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating announcement");
    }
};


const deleteAnnouncement = async (req, res) => {
    const announcementId = req.params.id; // Use req.params.id to match the route parameter
    try {
        const success = await Announcement.deleteAnnouncement(announcementId);
        if (!success) {
            return res.status(404).send("Announcement not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting announcement");
    }
};

module.exports = {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
