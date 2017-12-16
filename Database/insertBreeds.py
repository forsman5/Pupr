import mysql.connector

#todo
#open linkfile
#linkfile =
#open dog file
#breedfile = 

#open connection
cnx = mysql.connector.connect(user='admin', password='password',
                              host='petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com',
                              database='petland')

cursor = cnx.cursor()

insert_breed = "INSERT INTO Breeds (breed, link) VALUES (%s, %s)"

#TODO
#for breedLink in linkfile:
    #breedName = breedfile.next() #TODO
    #breed = (breedName, breedLink)

    cursor.execute(insert_breed, breed)

cnx.commit()


#close files
#TODO

#close connection
cursor.close()

cnx.close()
