# petlandcatalog
This is a web application used to display the personalities and faces of the exciting dogs at Central Ohio Petlands.
It is written in primarily in Nodejs, using Express and ejs to render the pages.
Some shell and python scripting is done for the database.

The main entry point is the top-level file controller.js.
Views, templates, and pages are found in the views folder, and these are rendered from controller.js
CSS, images, and other static resources are found in the resources folder.
Any scripts used to fill the db and any backup database info is found in the database folder.
The database is hosted as a mysql 5.7 instance on Amazon AWS Relational Database Service (RDS).
