DROP PROCEDURE IF EXISTS GetDogs;
DELIMITER //
CREATE PROCEDURE GetDogs()
BEGIN

SELECT outer1.dogID, name, favorites, comments, breed1, breed2
FROM
(SELECT Users_Dogs_comments.dogID, COUNT(comment) AS comments
  FROM Users_Dogs_comments
  GROUP BY dogID
  UNION
  SELECT Dogs.dogID, 0 AS comments
  FROM Dogs
  LEFT JOIN Users_Dogs_comments
  ON Dogs.dogID = Users_Dogs_comments.dogID
  WHERE Users_Dogs_comments.dogID IS NULL
) AS outer1
INNER JOIN
(SELECT c1.dogID, c1.name, c1.favorites, breed1, breed2
FROM (
  (SELECT dogID, name, favorites, breed AS breed1
   FROM Dogs
   INNER JOIN
   Breeds
   ON Breeds.breedID = Dogs.breedID)
  AS c1
  INNER JOIN
  (SELECT name, breed as breed2
   FROM Dogs
   INNER JOIN
   Breeds
   ON Breeds.breedID = Dogs.secondaryBreedID)
  AS c2
  ON
  c1.name = c2.name
)
UNION
SELECT dogID, name, favorites, breed AS breed1, NULL AS breed2
FROM (
  (SELECT *
   FROM Dogs
   WHERE secondaryBreedID IS NULL)
  AS d1
  INNER JOIN
  Breeds
  ON
  Breeds.breedID = d1.breedID
)) AS outer2
ON outer1.dogID = outer2.dogID
ORDER BY outer1.dogID;

END //
DELIMITER ;
