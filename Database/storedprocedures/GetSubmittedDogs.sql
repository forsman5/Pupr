DROP PROCEDURE IF EXISTS GetSubmittedDogs;
DELIMITER //
CREATE PROCEDURE GetSubmittedDogs(
  IN givenUser INT
)
BEGIN

SELECT c1.submissionID, c1.name, breed1, breed2, c1.numberOfFiles, c1.bio
FROM (
  (SELECT submissionID, name, breed as breed1, numberOfFiles, bio
   FROM Submitted_Dogs
   INNER JOIN
   Breeds
   ON Breeds.breedID = Submitted_Dogs.breedID
   WHERE userID = givenUser)
  AS c1
  INNER JOIN
  (SELECT name, breed as breed2
   FROM Submitted_Dogs
   INNER JOIN
   Breeds
   ON Breeds.breedID = Submitted_Dogs.secondaryBreedID
   WHERE userID = givenUser)
  AS c2
  ON c1.name = c2.name)
UNION
SELECT submissionID, name, breed AS breed1, NULL AS breed2, numberOfFiles, bio
FROM (
  (SELECT *
   FROM Submitted_Dogs
   WHERE secondaryBreedID IS NULL)
  AS d1
  INNER JOIN
  Breeds
  ON
  Breeds.breedID = d1.breedID
)
WHERE userID = givenUser
ORDER BY submissionID;

END //
DELIMITER ;
