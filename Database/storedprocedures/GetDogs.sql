DROP PROCEDURE IF EXISTS GetDog;
DELIMITER //
CREATE PROCEDURE GetDog()

BEGIN
SELECT secondaryBreedID INTO @secondID FROM Dogs

IF @secondID IS NULL THEN
  SELECT Dogs.name, Dogs.bio, Breeds.breed, Breeds.link
  FROM Dogs
  INNER JOIN Breeds
  ON Dogs.breedID = Breeds.breedID
  WHERE Dogs.dogID = id;
ELSE
  SELECT breed, link INTO @secondBreed, @secondLink FROM Breeds WHERE breedID = @secondID;

  SELECT Dogs.name, Dogs.bio, Breeds.breed, Breeds.link, @secondBreed AS 'secondBreed', @secondLink AS 'secondLink'
  FROM Dogs
  INNER JOIN Breeds
  ON Dogs.breedID = Breeds.breedID
  WHERE Dogs.dogID = id;
END IF;
END //
DELIMITER ;
