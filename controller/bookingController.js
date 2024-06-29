const Booking = require("../model/Booking");

const getAllBookings = async (req, res) => {
    try {
        const booking = await Booking.getAllBookings();
        res.json(booking);
    } catch(error) {
        console.log(error);
        res.status(500).send("Error retrieving booking");
    }
};

const getBookingById = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const booking = await Booking.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).send("Booking not found");
        }
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving booking")
    }
};

module.exports = {
    getAllBookings,
    getBookingById
};