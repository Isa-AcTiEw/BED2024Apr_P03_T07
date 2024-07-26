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

const getAllBookingByAccId = async (req, res) => {
    const accId = req.params.id;
    try {
        const booking = await Booking.getAllBookingByAccId(accId);
        if (!booking) {
            return res.status(404).send("Booking not found");
        }
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving booking")
    }
};

const createBooking = async (req, res) => {
    const newBooking = req.body;
    try {
        const createdBooking = await Booking.createBooking(newBooking);
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating booking");
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    getAllBookingByAccId,
    createBooking
};