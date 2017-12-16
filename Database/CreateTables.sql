DROP PROCEDURE IF EXISTS CreateTables;
DELIMITER //
CREATE PROCEDURE CreateTables()
BEGIN

DROP TABLE IF EXISTS Breeds;
CREATE TABLE Breeds (
	breedID int NOT NULL auto_increment,
	breed varchar(255) NOT NULL,
	
	PRIMARY KEY (breedID)
);

DROP TABLE IF EXISTS Dogs;
CREATE TABLE Dogs(
	dogID int NOT NULL auto_increment,
	name varchar(255) NOT NULL,
	bio varchar(255),
	photopath varchar(255),
	breedID int NOT NULL,
	
	PRIMARY KEY (dogID),
	FOREIGN KEY (breedID) REFERENCES Breeds(breedID)
);

DROP TABLE IF EXISTS Visits;
CREATE TABLE Visits(
	visitID int NOT NULL auto_increment,
	location varchar(255),
	date DATETIME,
	dogID int NOT NULL,
	
	PRIMARY KEY (visitID),
	FOREIGN KEY (dogID) REFERENCES Dogs(dogID)
);

END //
DELIMITER ;
	