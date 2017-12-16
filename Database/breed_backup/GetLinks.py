breedfile = open("breedList.txt", "r", encoding="utf-8")
wikifile = open("wikipediaSource.txt", "r", encoding="utf-8")

breedLines = breedfile.readlines()
breed = breedLines[0][:len(breedLines[0]) - 1]
count = 0
f = open("Links.txt", "w")

key = "href=\""

for line in wikifile:
    if (">" + str(breed) + "<") in line:
        startIndex = line.find(key) + len(key)
        stopIndex = line.find("\"", startIndex)

        link = line[startIndex:stopIndex]

        #add en.wikipedia.org/ to the link
        link = "en.wikipedia.org" + link

        #print the link
        f.write(str(link) + "\n")
        
        count += 1
        breed = breedLines[count][:len(breedLines[count]) - 1]

#close the files
breedfile.close()
wikifile.close()
f.close()


#Cuts of last dog entry, copy in by hand
#en.wikipedia.org/wiki/Yorkshire_Terrier
