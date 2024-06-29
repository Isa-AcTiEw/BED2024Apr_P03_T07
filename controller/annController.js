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
  
  const getAllAnnouncementById = async (req, res) => {
    try {
      const AnnID = req.params.id;
      const announcement = await Announcement.getAnnouncementById(AnnID);
      res.json(announcement);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving announcement");
    }
  };
  
  
  const updateAnnouncement = async (req, res) => {
    const AnnouncementId = parseInt(req.params.id);
    const newAnnouncementData = req.body;
  
    try {
      const updatedAnnouncement = await Announcement.updateAnnouncement(AnnouncementId, newAnnouncementData);
      if (!updatedAnnouncement) {
        return res.status(404).send("Announcement not found");
      }
      res.json(updatedAnnouncement);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating Announcement");
    }
  };
  
  module.exports = {
      getAllAnnouncements,
      getAllAnnouncementById,
      updateAnnouncement,
    };
  
  