import mysql.connector

linkfile = open("Links.txt", "r", encoding="utf-8")
breedfile = open("breedList.txt", "r", encoding="utf-8")
breedLines = breedfile.readlines()
count = 0

#open connection
cnx = mysql.connector.connect(user='admin', password='password',
                              host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                              database='petland')

catBreeds = [["Black Cat", "en.wikipedia.org/wiki/Black_Cat"],
             ["Siamese Cat", "en.wikipedia.org/wiki/Siamese_cat"]]

cursor = cnx.cursor()

insert_breed = "INSERT INTO Breeds (breed, link) VALUES (%s, %s)"

for breedLink in linkfile:
    breedLink = breedLink[:len(breedLink) - 1]
    breedName = breedLines[count][:len(breedLines[count]) - 1]
    breed = (breedName, breedLink)
    count += 1
    cursor.execute(insert_breed, breed)

for breed in catBreeds:
    cursor.execute(insert_breed, breed)

cnx.commit()

#close files
linkfile.close()
breedfile.close()

#close connection
cursor.close()

cnx.close()
