import os
import mysql.connector

imagesPath = '../../resources/images/'

folders = os.listdir(imagesPath)

#open connection
cnx = mysql.connector.connect(user='admin', password='password',
                              host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                              database='petland')

cursor = cnx.cursor()

query = "INSERT INTO Dogs (name, bio, breedID, secondaryBreedID) values (%s, %s, %s, %s)"

#photopath removed:
#photopath will always be ./resources/images/NAME_OF_DOG/
#so no need to store it

#similarly, the profile images will always be
#./resources/images/NAME_OF_DOG/profile.<png | jpg>

getID = "SELECT breedID FROM Breeds WHERE breed = \""

for folder in folders:
    print("get_dogs: handling: " + folder)

    #open this readme.txt
    readFile = open(os.path.abspath(imagesPath + folder + "/bio.txt"), "r", encoding="utf-8")
    lines = readFile.readlines()

    #concatenate list into one long string
    bioLines = lines[2:]
    bio = ""
    for line in bioLines:
        bio += line

    cursor.execute(getID + lines[0][:len(lines[0]) - 1] + "\"")

    res = cursor.fetchone()
    breedID = str(res[0])

    cursor.execute(getID + lines[1] + "\"")
    res = cursor.fetchone()
    if (res is not None):
        secondaryBreedID = str(res[0])
    else:
        secondaryBreedID = None

    cursor.execute(query, (folder, bio, breedID, secondaryBreedID))

    #close file
    readFile.close()

cnx.commit()

#close connection
cursor.close()

cnx.close()
