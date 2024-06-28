--DDL
---- Drop foreign key constraints
--ALTER TABLE Booking DROP CONSTRAINT FK_Booking_Account;
--ALTER TABLE Registration DROP CONSTRAINT FK_Registration_Event;
--ALTER TABLE Registration DROP CONSTRAINT FK_Registration_Account;
--ALTER TABLE Announcement DROP CONSTRAINT FK_Announcement_Admin;
--ALTER TABLE Feedback DROP CONSTRAINT FK_Feedback_Account;

---- Drop tables
--DROP TABLE IF EXISTS Booking;
--DROP TABLE IF EXISTS Registration;
--DROP TABLE IF EXISTS Announcement;
--DROP TABLE IF EXISTS Feedback;
--DROP TABLE IF EXISTS Facilities;
--DROP TABLE IF EXISTS Admin;
--DROP TABLE IF EXISTS Account;
--DROP TABLE IF EXISTS Event;
--DROP TABLE IF EXISTS EventMgr;
--DROP TABLE IF EXISTS FacilitiesMgr;
--DROP TABLE IF EXISTS FacTimeSlot;

-- Create Account Table
CREATE TABLE Account(
	AccID varchar(10) NOT NULL,
	AccName varchar(30) NOT NULL,
	AccEmail varchar(30) NOT NULL,
	AccCtcNo varchar(15) NOT NULL,
	AccDOB smalldatetime NOT NULL,
	AccAddr varchar(100) NOT NULL
	CONSTRAINT PK_Account PRIMARY KEY (AccID)
);

-- Create EventMgr table
CREATE TABLE EventMgr(
	EventMgrID varchar(10) NOT NULL,
	CONSTRAINT PK_EventMgr PRIMARY KEY (EventMgrID),
	CONSTRAINT FK_EventMgr_Account 
		FOREIGN KEY(EventMgrID)REFERENCES Account(AccID)
);

-- Create Event table
CREATE TABLE Event(
	EventID varchar(10) NOT NULL,
	EventName varchar(100) NOT NULL,
	EventDesc varchar(300) NOT NULL,
	EventPrice tinyint NOT NULL,
	EventDate smalldatetime NOT NULL,
	EventCat varchar(100) NOT NULL,
	EventLocation varchar(30) NOT NULL,
	EventRegEndDate smalldatetime NOT NULL,
	EventMgrID varchar(10) NULL,
	EventIntake smallint NOT NULL,
	CONSTRAINT CHK_EventRegEndDate 
		CHECK(EventRegEndDate < EventDate),
	CONSTRAINT CHK_EventCat CHECK
		(EventCat IN 
		('Arts and Culture' , 'Active Aging' , 'Cooking' , 'Environment' , 'Festivities' , 'Lifelong Learning') ),
	CONSTRAINT PK_Event PRIMARY KEY (EventID),
	CONSTRAINT FK_Event_EventMgr
		FOREIGN KEY (EventMgrID) REFERENCES EventMgr(EventMgrID)
);

-- Create Admin table
CREATE TABLE Admin(
	AdminID varchar(10) NOT NULL,
	CONSTRAINT PK_Admin PRIMARY KEY (AdminID),
	CONSTRAINT FK_Admin_Account 
		FOREIGN KEY(AdminID)REFERENCES Account(AccID)
);

-- Create Announcement table
CREATE TABLE Announcement (
    AnnID varchar(10) NOT NULL,
    AnnName varchar(30) NOT NULL,
    AnnDesc varchar(500) NOT NULL,
    AdminID varchar(10) NOT NULL,
    CONSTRAINT PK_Announcement PRIMARY KEY (AnnID),
    CONSTRAINT FK_Announcement_Admin
        FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)  
);

-- Create Feedback table
CREATE TABLE Feedback (
    FbkID varchar(10) NOT NULL,
    FbkName varchar(30) NOT NULL,
    FbkDateTime smalldatetime NOT NULL,
    FbkDesc varchar(300) NOT NULL,
    AdminID varchar(10) NOT NULL,
    CONSTRAINT PK_Feedback PRIMARY KEY (FbkID),
    CONSTRAINT FK_Feedback_Account
        FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Create FacilitiesMgr table
CREATE TABLE FacilitiesMgr(
	FacMgrID varchar(10) NOT NULL,
	CONSTRAINT PK_FacMgrID PRIMARY KEY (FacMgrID),
	CONSTRAINT FK_FacilitiesMgr_Account 
		FOREIGN KEY(FacMgrID)REFERENCES Account(AccID)
);

-- Create Facilities table
CREATE TABLE Facilities (
    FacID varchar(10) NOT NULL PRIMARY KEY,
    FacName varchar(50) NOT NULL,
    FacDesc varchar(255) NULL
);

-- Create FacTimeSlot table (Weak Entity)
CREATE TABLE FacTimeSlot (
    FacID varchar(10) NOT NULL,
    TimeSlotSN varchar(20) NOT NULL,
    PRIMARY KEY (FacID, TimeSlotSN),
    FOREIGN KEY (FacID) REFERENCES Facilities(FacID)
);

-- Create Booking table (facilities)
CREATE TABLE Booking (
	BookID varchar(10) NOT NULL,
	BookDate smalldatetime NOT NULL,  
	BookStatus varchar(10) NOT NULL CHECK (BookStatus IN ('Pending', 'Approved', 'Cancelled')),
	FacID varchar(10) NOT NULL,
	AccID varchar(10) NOT NULL,
	CONSTRAINT PK_Booking PRIMARY KEY (BookID),
	CONSTRAINT FK_Booking_Facilities FOREIGN KEY (FacID) REFERENCES Facilities(FacID),
	CONSTRAINT FK_Booking_Account FOREIGN KEY (AccID) REFERENCES Account(AccID)
);

-- Create Registration table for events
CREATE TABLE Registration (	
	RegID varchar(10) NOT NULL,
	RegDate smalldatetime NOT NULL,
	RegStatus varchar(10) NOT NULL CHECK (RegStatus IN ('Active', 'Cancelled')),
	EventID varchar(10) NOT NULL,
	AccID varchar(10) NOT NULL,
	CONSTRAINT PK_Registration PRIMARY KEY (RegID),
	CONSTRAINT FK_Registration_Event FOREIGN KEY (EventID) REFERENCES Event(EventID),
	CONSTRAINT FK_Registration_Account FOREIGN KEY (AccID) REFERENCES Account(AccID)
);