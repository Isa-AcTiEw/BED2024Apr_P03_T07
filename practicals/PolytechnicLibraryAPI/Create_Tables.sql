CREATE DATABASE PolytechnicLibraryDB;
USE PolytechnicLibraryDB;
CREATE TABLE Users(
    user_id INT NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20)
	CONSTRAINT CHECK_role CHECK (role IN 
        ('member' , 'libarian' ))
)

CREATE TABLE Books(
    book_id INT NOT NULL,
    title VARCHAR(255) NULL,
    author VARCHAR(255) NULL,
    availability CHAR(1) NULL,
)
