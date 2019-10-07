const path = require("path");
const multer = require("multer");
var express = require("express");
const router = express.Router();
var pool = require("../DbConnection");
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

//update profile picture of customer
router.route("/upload").post(upload, function(req, res) {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file); //Here you get file.

  console.log(req.file.filename);

  if (req.file) {
    var email = req.body.email;
    var lowercaseemail = email.toLowerCase();
    var trimemail = lowercaseemail.trim();
    var userData = {
      image_name: req.file.filename
    };

    pool.query(
      "UPDATE customers SET ? WHERE email = ?",
      [userData, trimemail],
      function(error, result) {
        if (error) {
          console.log(error);
          console.log("unable to update the file into database");
          res.status(400).json({
            responseMessage: "unable to update the file into database"
          });
        } else {
          res.status(200).json({
            responseMessage: "File Name added",
            fileName: req.file.filename
          });
        }
      }
    );
  }
});

//update profile picture of owner

router.route("/owner/upload").post(upload, function(req, res) {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file); //Here you get file.

  console.log(req.file.filename);

  if (req.file) {
    var email = req.body.email;
    var lowercaseemail = email.toLowerCase();
    var trimemail = lowercaseemail.trim();
    var userData = {
      image_name: req.file.filename
    };

    pool.query(
      "UPDATE owners SET ? WHERE email = ?",
      [userData, trimemail],
      function(error, result) {
        if (error) {
          console.log(error);
          console.log("unable to update the file into database");
          res.status(400).json({
            responseMessage: "unable to update the file into database"
          });
        } else {
          res.status(200).json({
            responseMessage: "File Name added",
            fileName: req.file.filename
          });
        }
      }
    );
  }
});

//update  picture of restaurant
router.route("/owner/restaurant/upload").post(upload, function(req, res) {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file); //Here you get file.

  console.log(req.file.filename);

  if (req.file) {
    var email = req.body.email;
    var lowercaseemail = email.toLowerCase();
    var trimemail = lowercaseemail.trim();
    var userData = {
      rest_image_name: req.file.filename
    };

    pool.query(
      "UPDATE restaurants SET ? WHERE email = ?",
      [userData, trimemail],
      function(error, result) {
        if (error) {
          console.log(error);
          console.log("unable to update the file into database");
          res.status(400).json({
            responseMessage: "unable to update the file into database"
          });
        } else {
          res.status(200).json({
            responseMessage: "File Name added",
            fileName: req.file.filename
          });
        }
      }
    );
  }
});

router.route("/item/upload").post(upload, function(req, res) {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file); //Here you get file.

  console.log(req.file.filename);

  if (req.file) {
    var userData = {
      item_image_name: req.file.filename
    };

    var itemId = req.body.itemID;
    console.log("&&&&&", req.body.itemID);

    pool.query(
      "UPDATE items SET ? WHERE item_id = ?",
      [userData, itemId],
      function(error, result3) {
        if (error) {
          console.log(error);
          console.log("unable to update the file into database");
          res.status(400).json({
            responseMessage: "unable to update the file into database"
          });
        } else {
          console.log("i am df an idia", result3);
          res.status(200).json({
            responseMessage: "File Name added",
            fileName: req.file.filename
          });
        }
      }
    );
  }
});

module.exports = router;
