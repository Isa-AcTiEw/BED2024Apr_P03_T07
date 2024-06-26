---- Create Account Table
CREATE TABLE Account(
	AccID varchar(10) NOT NULL,
	AccName varchar(30) NOT NULL,
	AccEmail varchar(30) NOT NULL,
	AccCtcNo int NOT NULL,
	AccDOB smalldatetime NOT NULL,
	AccAddr varchar(100) NOT NULL
	CONSTRAINT PK_Account PRIMARY KEY (AccID)
	
	
);

CREATE TABLE EventMgr(
	EventMgrID varchar(10) NOT NULL,
	CONSTRAINT PK_EventMgr PRIMARY KEY (EventMgrID),
	CONSTRAINT FK_EventMgr_Account 
		FOREIGN KEY(EventMgrID)REFERENCES Account(AccID)
);




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

