# Community-Fridge
Title: Community Fridge Management Web Application
Author: Moziah Smart
Student Number: 101189697

Directory Structure:
config.js: Configuration script for MongoDB connection.
data (Folder):
comm-fridge-data.json: Initial data for community fridges.
comm-fridge-items.json: Initial data for fridge items.
comm-fridge-types.json: Initial data for item types.
fridge-router.js: Router script for fridge-related API routes.
models (Folder):
fridgeModel.js: Mongoose model for fridges.
itemModel.js: Mongoose model for items.
typeModel.js: Mongoose model for item types.
node_modules: Node.js modules directory.
package-lock.json: Lock file for exact npm package versions.
package.json: Project metadata and dependencies.
public (Folder):
addFridge.html: Page for adding a new fridge.
css (Folder): Stylesheets directory.
drop.html: Page for dropping items in a fridge.
editFridge.html: Page for editing fridge details.
images (Folder): Images directory.
index.html: Main entry page.
js (Folder): Client-side JavaScript scripts directory.
search.html: Page for searching items.
view_pickup.html: Page for viewing and picking up items.
ReadMe.txt: Project description and instructions.
search-router.js: Router script for search-related API routes.
server.js: Main server script.
Installation:
Ensure you have Node.js installed on your machine.
Navigate to the project directory in your terminal.
Run the following commands to install the necessary Node.js modules:
bash
Copy code
npm install express mongodb mongoose
Running the Application:
In the project directory, execute the following command to start the server:
bash
Copy code
node server.js
Open your web browser and navigate to http://localhost:3000 (or the respective URL and port where your Express server is running).
Features:
Browse, add, and manage community fridges and items.
RESTful API for handling CRUD operations.
Integration with MongoDB for data persistence.
Client-side search functionality to filter items based on type and name.
Notes:
Ensure MongoDB connection credentials in config.js are set up correctly before running the application.
