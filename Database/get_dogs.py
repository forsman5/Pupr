import os
import mysql.connector

folders = os.listdir('../resources/images/')

#open connection
cnx = mysql.connector.connect(user='admin', password='password',
                              host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                              database='petland')

cursor = cnx.cursor()

query = "INSERT INTO Dogs (name, bio, breedID, secondaryBreedID) values (\"%s\", \"%s\", %s, %s)"

getID = "SELECT breedID FROM Breeds WHERE breed = \""

for folder in folders:
    #open this readme.txt
    readFile = open(os.path.abspath('../resources/images/' + folder + "/bio.txt"), "r", encoding="utf-8")
    lines = readFile.readlines()

    name = folder

    #concatenate list into one long string
    bioLines = lines[2:]
    bio = ""
    for line in bioLines:
        bio += line

    cursor.execute(getID + lines[0][:len(lines[0]) - 1] + "\"")

    res = cursor.fetchone()
    if (res is not None):
        breedID = str(res[0])
    else:
        breedID = "1"

    cursor.execute(getID + lines[1] + "\"")
    res = cursor.fetchone()
    if (res is not None):
        secondaryBreedID = str(res[0])
    else:
        secondaryBreedID = None

    cursor.execute(query, (name, bio, breedID, secondaryBreedID))

    #close file
    readFile.close()

cnx.commit()

#close connection
cursor.close()

cnx.close()
