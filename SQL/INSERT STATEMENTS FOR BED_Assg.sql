CREATE DATABASE bedAssg_db
DROP DATABASE bedAssg_db
USE bedAssg_db;
--SELECT * FROM Booking WHERE AccID = 'ACC505'
--delete from Booking where AccID = 'ACC505'

--INSERT INTO Admin VALUES ('ADM003','staffAccount@gmail.com','$2b$10$SsNAdfEZNxOYeMKEKhlVZOktrZrDEhbMyPNeVm24//dwy.TouzN9m')

SELECT * FROM Account
INSERT INTO Account 
VALUES
('ADM001', 'Admin', '123Admin@gmail.com', '91346128', '66 Marine Parade Road, #09-876', '783273', '1990-02-03', '123456'),
('EVT001', 'Event', '123Events@gmail.com', '90836789', '7 One-North Residences, #10-10','729346', '1998-04-14','123456'),
('FAL001', 'Facilities', '123Faciities@gmail.com', '89203754','15 Pasir Ris Drive 1, #03-20', '238893', '1984-12-25','123456'),
('ACC002', 'Emily Tan', 'emilytan@gmail.com', '92345678', 'Blk 123 Ang Mo Kio Ave 4, #05-12', '659083', '1995-08-21', '123456');

INSERT INTO EventMgr
VALUES 
('EVT001');

INSERT INTO Event
VALUES
('Ev00001', 'Mass zumba dancing', 
'Calling all Elderlies, stay fit and healthy with this mass zumba activity catered especially for you. No learning experience required', 
'0', '2024-07-14' , 'Active Aging', 'Bishan Community Club', '2024-06-28', 'EVT001', '300'),

('Ev00002', 'Culinary lesson by celebrity chef Eric', 
'Calling all homecool enthusiasts, hone your skills in cooking local cuisines in this once in a lifetime opportunity taught by Chef Eric', 
'0', '2024-08-21' , 'Cooking', 'Bishan Community Club', '2024-07-28', 'EVT001', '80'),

('Ev00003', 'Chinese calligraphy painting', 
'Learn more about the chinese culture through the art of traditional chinese calligraphy painting', 
'0', '2024-09-17' , 'Arts and Culture', 'Bishan Community Club', '2024-08-28', 'EVT001', '150'),

('Ev00004', 'New Year''s Eve Countdown Celebration', 
'Calling all residents usher in 2024 with our annual New Year''s Eve Celebration, accompanied with various performances sure to bring a delight to everyone. ', 
'0', '2023-12-31' , 'Festivities', 'Bishan Community Club', '2023-12-20', 'EVT001', '550'),

('Ev00005', 'Learning Generative A.I.', 
'Hone your generative A.I. skills learn how to prompt effectively and understand the ethical concerns of generative A.I.', 
'0', '2024-07-14' , 'Lifelong Learning', 'Bishan Community Club', '2024-06-30', 'EVT001', '300')

INSERT INTO Admin
VALUES
('ADM001', 'Peter', 'SGGoofyAdmin@gmail.com','Approved');

INSERT INTO Announcement
VALUES
('Maintenance', 'We will be performing scheduled maintenance on our website to improve performance and security. The website will be temporarily unavailable from 12:00 AM to 11:59 PM on July 1st. We apologize for any inconvenience this may cause and appreciate your understanding.'),
('Update Your Profile', 'Make sure you don’t miss out on any of our events! Update your profile settings to receive notifications about upcoming events and activities. Stay informed and stay connected.');

INSERT INTO Feedback
VALUES
('Friendly Staff', 'Excellent', '2024-05-30 13:13:49', 'The staff at the front desk are always friendly and helpful. They make every visit to the community club enjoyable.', 'ACC002'),
('Gym Equipment Issue', 'Poor', '2024-06-13 10:36:52', 'Some of the gym equipment needs maintenance. The treadmill is making a strange noise, and one of the weight machines is broken.', 'ACC002');

INSERT INTO FacilitiesMgr
VALUES
('FAL001')

INSERT INTO Facilities
VALUES
('FAC001', 'BBQ Pit', 'Book a barbecue pit to cook and enjoy a meal in the outdoors.'),
('FAC002', 'Badminton Court', 'Book a badminton court to play and enjoy a game of badminton with friends.'),
('FAC003', 'Basketball Court', 'Reserve our basketball court to refine your skills and challenge your limits. Perfect for solo practice or competitive play.'),
('FAC004', 'Pool table', 'Reserve the pool table for a fun game of billiards.');

INSERT INTO FacTimeSlot
VALUES
('FAC001', '6:00PM-11:00PM'),
('FAC002', '8:00AM-10:00AM'),
('FAC002', '10:00AM-12:00PM'),
('FAC003', '8:00AM-10:00AM'),
('FAC003', '10:00AM-12:00PM'),
('FAC004', '8:00AM-9:00AM'),
('FAC004', '9:00AM-10:00AM');

INSERT INTO Booking
VALUES 
('B001', '2024-06-28', 'Pending', 'FAC001', 'ADM001'),
('B002', '2024-06-29', 'Pending', 'FAC002', 'ADM001');

INSERT INTO Registration
VALUES 
('R001', '2024-06-28', 'Active', 'Ev00001', 'EVT001'),
('R002', '2024-06-29', 'Active', 'Ev00002', 'EVT001');


