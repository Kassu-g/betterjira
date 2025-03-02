Kanban Project
A simple Kanban board web application that allows users to register, log in, create columns, add, remove, and move cards. This application is inspired by Jira (which I hate to use in work) and is built using Node.js, Express, MongoDB, and Frontend using HTML, CSS, and JavaScript.

User Authentication:
Users can register and log in with their email and password.
JWT (JSON Web Token) is used for secure authentication.

Board Features:
Users can create columns for their board.
Users can add, remove, and move cards between columns.

Design:
App can be use desktop or mobile.

Technology Stack
Backend:
Node.js with Express.js for building the REST API.
MongoDB with Mongoose for database management.
Frontend:
HTML, CSS (with TailwindCSS) for building the user interface.
JavaScript for frontend logic and AJAX requests to interact with the backend.


Installation
Backend Setup
Clone this repository to your computer:
git clone <repository_url>
cd <repository_folder>
Install the required dependencies:
"npm install"
Set up your MongoDB database:
Make sure you have MongoDB running locally, or use a cloud MongoDB provider (e.g., MongoDB Atlas).
Update the connection string in the .env file:
DB_URI=mongodb://localhost:27017/jira
JWT_SECRET=your_secret_key_here

Start backend server by running 
node server.js
in server folder

Start frontend by running 
http-server
in client folder


