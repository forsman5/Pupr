#This file is used to create demo bio files or can remove them
#calling python dogs_setup.py removeFiles will remove the files Created
#calling python dogs_setup.py setup will create new files

import os
import random
import mysql.connector
import sys

#path to images folder
imagesPath = '../../resources/images/'

def getFolders():
    return os.listdir(imagesPath)

def setup():
    random.seed()

    #open connection
    cnx = mysql.connector.connect(user='admin', password='password',
                                  host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                                  database='petland')

    cursor = cnx.cursor()

    query = "SELECT breed FROM Breeds WHERE BreedID = "

    for folder in getFolders():
        print("dog_setup: handling: " + folder)

        writeFile = open(os.path.abspath(imagesPath + folder + "/bio.txt"), "w+", encoding="utf-8")

        cursor.execute(query + str((random.randint(1, 514))))

        writeFile.write(str(cursor.fetchone()[0]) + "\n")

        writeFile.write("null\n")

        writeFile.write("Test bio line 1 \n")
        writeFile.write("Test bio line2 \n")

        writeFile.close()

    cnx.commit()

    cursor.close()

    cnx.close()

def removeFiles():
    for folder in getFolders():
        os.remove(os.path.abspath(imagesPath + folder + "/bio.txt"))
        print("Removed: " + os.path.abspath(imagesPath + folder + "/bio.txt"))

if (sys.argv[1] == "removeFiles"):
    removeFiles()
elif (sys.argv[1] == "setup"):
    setup()
