import os
import mysql.connector

folders = os.listdir('../resources/images/')

#open connection
cnx = mysql.connector.connect(user='admin', password='password',
                              host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                              database='petland')

cursor = cnx.cursor()

query = "INSERT INTO Dogs (name, bio, photopath, breedID, secondaryBreedID) values (%s, %s, %s, %s)"

getID = "SELECT breedID FROM Breeds WHERE breed = %s"

for folder in folders:
    #open this readme.txt
    readFile = open(os.path.abspath('../resources/images/' + folder + "/bio.txt"), "r", encoding="utf-8")
    lines = readFile.readlines()

    name = folder
    bio = lines[2:]
    photopath = "/resources/images/" + folder

    breedID = cursor.execute(getID, lines[0])

    if (lines[1] != "null"):
        secondaryBreedID = cursor.execute(getID, lines[1])
    else:
        secondaryBreedID = lines[1]

    data = (name, bio, photopath, breedID, secondaryBreedID)

    cursor.execute(query, data)

    #close file
    readFile.close()

cnx.commit()

#close connection
cursor.close()

cnx.close()
