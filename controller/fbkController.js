const Feedback = require('../model/Feedback');

const getAllFeedbacks = async (req, res) => {
    try {
        const Feedbacks = await Feedback.getAllFeedbacks();
        res.json(Feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Feedbacks");
    }
};

const getFeedbackById = async (req, res) => {
    const FeedbackId = req.params.id;
    try {
        const Feedback = await Feedback.getFeedbackById(FeedbackId);
        res.json(Feedback);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Feedback")
    }
};

const createFeedback = async (req, res) => {
    const newAnn = req.body;
    try {
        const createdAnn = await Feedback.createFeedback(newAnn);
        res.status(201).json(createdAnn);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating Feedback");
    }
};

const updateFeedback = async (req, res) => {
    const FbkID = parseInt(req.params.id);
    const newFbkData = req.body;
    try {
        const updatedFeedback = await Feedback.updateFeedback(FbkID, newFbkData);
        if (!updatedFeedback) {
            return res.status(404).json("Feedback not found");
        } 
        res.json(updateFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating Feedback");
    }
};


const deleteFeedback = async (req, res) => {
    const FeedbackId = req.params.id; 
    try {
        const success = await Feedback.deleteFeedback(FeedbackId);
        if (!success) {
            return res.status(404).send("Feedback not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting Feedback");
    }
};

module.exports = {
    getAllFeedbacks,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback
};