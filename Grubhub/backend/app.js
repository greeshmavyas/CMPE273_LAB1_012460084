//libraries
var express = require("express");
var path = require("path");
var jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var urlencodedPraser = bodyParser.urlencoded({ extended: false });
var createError = require("http-errors");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

//my api routes
var loginRoutes = require("./routes/loginRoutes");
var ownerItemOperations = require("./routes/ownerItemOperations");
var customerItemOperations = require("./routes/customerItemOperations");
var customerOrderOperations = require("./routes/customerOrderOperations");
var ownerOrderOperations = require("./routes/ownerOrderOperations");
var uploadImage = require("./routes/upload");

//app instance
var app = express();

//server configuration
var basePath = "/grubhub";
var port = 5001;

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_grubhub_mysql",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

//Allow Access Control
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
  next();
});
app.use(express.static("public"));
app.use(express.static("uploads"));
//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//my apis
app.use(basePath, loginRoutes);
app.use(basePath, ownerItemOperations);
app.use(basePath, customerItemOperations);
app.use(basePath, customerOrderOperations);
app.use(basePath, ownerOrderOperations);
app.use(basePath, uploadImage);

// Execute App
app.listen(port, () => {
  console.log("Grubhub Backend is running on Port: ", port);
});
