// Import the modules we need
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mysql = require("mysql");
const cookieParser = require("cookie-parser");
const local = false;
const baseUrl = local ? "/" : "https://www.doc.gold.ac.uk/usr/454/";

const db = mysql.createConnection({
  host: "localhost",
  user: "alari001",
  password: "1234",
  database: "forum",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

// Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Set up css
app.use(express.static(__dirname + "/public"));

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set("views", __dirname + "/views");

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine("html", ejs.renderFile);

// Define our data
var shopData = { shopName: "Bertie's Books" };

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, shopData, baseUrl);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
