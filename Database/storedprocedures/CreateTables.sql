DROP PROCEDURE IF EXISTS CreateTables;
DELIMITER //
CREATE PROCEDURE CreateTables()
BEGIN

DROP TABLE IF EXISTS Reported_commnets;
DROP TABLE IF EXISTS Users_Dogs_comments;
DROP TABLE IF EXISTS Users_Dogs_favorites;
DROP TABLE IF EXISTS Visits;
DROP TABLE IF EXISTS Dogs;
DROP TABLE IF EXISTS Breeds;
DROP TABLE IF EXISTS Users;

CREATE TABLE Breeds (
	breedID int NOT NULL auto_increment,
	breed varchar(255) NOT NULL,
	link varchar(255),

	PRIMARY KEY (breedID)
);

CREATE TABLE Dogs(
	dogID int NOT NULL auto_increment,
	name varchar(255) NOT NULL UNIQUE,
	bio varchar(2047),
	breedID int NOT NULL,
	secondaryBreedID int,
	favorites int DEFAULT 0,

	PRIMARY KEY (dogID),
	FOREIGN KEY (breedID) REFERENCES Breeds(breedID),
	FOREIGN KEY (secondaryBreedID) REFERENCES Breeds(breedID)
);

CREATE TABLE Visits(
	visitID int NOT NULL auto_increment,
	location varchar(255),
	date DATETIME,
	dogID int NOT NULL,

	PRIMARY KEY (visitID),
	FOREIGN KEY (dogID) REFERENCES Dogs(dogID)
);

CREATE TABLE Users(
	userID int NOT NULL auto_increment,
	name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	verified BIT(1) NOT NULL DEFAULT 0,
	verifyHash VARCHAR(32),
	admin BIT(1) NOT NULL DEFAULT 0,

	PRIMARY KEY (userID)
);

CREATE TABLE Users_Dogs_favorites(
	userID int NOT NULL,
	dogID int NOT NULL,
	FOREIGN KEY (dogID) REFERENCES Dogs(dogID),
	FOREIGN KEY (userID) REFERENCES Users(userID),
	PRIMARY KEY (dogID,userID)
);

CREATE TABLE Users_Dogs_comments(
	userID int NOT NULL,
	dogID int NOT NULL,
	comment varchar(2047),
	commentID int NOT NULL auto_increment,
	FOREIGN KEY (dogID) REFERENCES Dogs(dogID),
	FOREIGN KEY (userID) REFERENCES Users(userID),
	PRIMARY KEY (commentID)
);

CREATE TABLE Reported_commnets(
	reporterID int NOT NULL,
	commentID int NOT NULL,

	FOREIGN KEY (reporterID) REFERENCES Users(userID),
	FOREIGN KEY (commentID) REFERENCES Users_Dogs_comments(commentID)
);

END //
DELIMITER ;
