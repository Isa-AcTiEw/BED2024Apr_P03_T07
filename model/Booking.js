class Booking {
    constructor(BookID, BookDate, BookStatus, FacID, AccID) {
        this.BookID = BookID;
        this.BookDate = BookDate;
        this.BookStatus = BookStatus;
        this.FacID = FacID;
        this.AccID = AccID;
    }
}
module.exports = Booking;