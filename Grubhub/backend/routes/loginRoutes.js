var express = require("express");
var pool = require("../DbConnection");
var router = express.Router();
var crypt = require("../bcrypt.js");

// Validate customer login
router.route("/customer/login").post(function(req, res) {
  console.log("Inside customer Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;

  pool.query(
    "SELECT * FROM customers WHERE email = ?",
    [trimemail],
    (err, rows) => {
      if (err) {
        console.log("Customer does not exist");
        res.status(400).json({ responseMessage: "Customer does not exist" });
      } else {
        if (rows.length > 0) {
          // Check if password matches
          crypt.compareHash(password, rows[0].password, function(err, isMatch) {
            if (isMatch && !err) {
              res.cookie("cookie1", "customercookie", {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              res.cookie("cookie2", trimemail, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              res.cookie("cookie3", rows[0].firstname, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              console.log(req);
              console.log(rows[0].email);
              req.session.user = rows[0].email;
              res.status(200).json({ responseMessage: "Login Successful" });
              console.log("Customer found in DB");
            } else {
              res.status(401).json({
                responseMessage:
                  "Authentication failed. Password did not match."
              });
              console.log("Authentication failed. Passwords did not match.");
            }
          });
        } else {
          res.status(402).json({
            responseMessage: "Authentication failed. Customer does not exist."
          });
          console.log("Authentication failed. Customer does not exist.");
        }
      }
    }
  );
});

// Validate owner login
router.route("/owner/login").post(function(req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();

  pool.query(
    "SELECT * FROM owners WHERE email = ?",
    [trimemail],
    (err, rows) => {
      if (err) {
        console.log("Owner does not exist");
        res.status(400).json({ responseMessage: "Owner does not exist" });
      } else {
        if (rows.length > 0) {
          crypt.compareHash(req.body.password, rows[0].password, function(
            err,
            isMatch
          ) {
            if (isMatch && !err) {
              res.cookie("cookie1", "ownercookie", {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              res.cookie("cookie2", trimemail, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              res.cookie("cookie3", rows[0].firstname, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              req.session.user = rows[0].email;
              console.log("Owner found in DB");
              res.status(200).json({ responseMessage: "Login Successful" });
            } else {
              res.status(401).json({
                responseMessage:
                  "Authentication failed. Passwords did not match."
              });
              console.log("Authentication failed. Passwords did not match.");
            }
          });
        } else {
          res.status(402).json({
            responseMessage: "Authentication failed. Owner does not exist."
          });
          console.log("Authentication failed. Owner does not exist.");
        }
      }
    }
  );
});

// Add customers
router.route("/customer/signup").post(function(req, res) {
  console.log("In customer Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();

  pool.query(
    "SELECT * FROM customers WHERE email = ?",
    [trimemail],
    (err, rows) => {
      if (err) {
        console.log(err);
        console.log("unable to read the database");
        res
          .status(400)
          .json({ responseMessage: "unable to read the customers database" });
      } else {
        if (rows.length > 0) {
          console.log("This customer already exists");
          res
            .status(400)
            .json({ responseMessage: " This customer already exists" });
        } else {
          crypt.createHash(
            req.body.password,
            function(response) {
              encryptedPassword = response;

              var userData = {
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: trimemail,
                password: encryptedPassword
              };

              //Save the user in database
              pool.query("INSERT INTO customers SET ?", userData, function(
                err
              ) {
                if (err) {
                  console.log("unable to insert into database", err);
                  res.status(400).send("unable to insert into database");
                } else {
                  console.log("Customer Added");
                  res.cookie("cookie1", "customercookie", {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/"
                  });
                  res.cookie("cookie2", trimemail, {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/"
                  });
                  res.cookie("cookie3", req.body.firstname, {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/"
                  });
                  res.status(200).json({ responseMessage: "Customer Added" });
                }
              });
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }
    }
  );
});

// Add owners
router.route("/owner/signup").post(function(req, res) {
  console.log("In owner Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();

  pool.query(
    "SELECT * FROM owners WHERE email = ?",
    [trimemail],
    (err, rows) => {
      if (err) {
        console.log(err);
        console.log("unable to read the database");
        res
          .status(400)
          .json({ responseMessage: "unable to read the owners database" });
      } else {
        if (rows.length > 0) {
          console.log("This customer already exists");
          res
            .status(400)
            .json({ responseMessage: " This customer already exists" });
        } else {
          crypt.createHash(
            req.body.password,
            function(response) {
              encryptedPassword = response;
              let status = "";
              var userData = {
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: trimemail,
                password: encryptedPassword,
                phone_number: req.body.phone
              };

              var restaurantData = {
                restaurant_name: req.body.rname,
                cuisine: req.body.cuisine,
                email: trimemail,
                zip_code: req.body.zipcode
              };

              //Save the owner in database
              pool.query("INSERT INTO owners SET ?", userData, function(err) {
                if (err) {
                  console.log("unable to insert owner into database", err);
                  res.status(400).send("unable to insert owner into database");
                } else {
                  console.log("Owner Added");
                  status = status + "Successfully inserted owner in DB. ";
                  //Save the restaurant in database
                  pool.query(
                    "INSERT INTO restaurants SET ?",
                    restaurantData,
                    function(err) {
                      if (err) {
                        console.log(
                          "unable to insert restaurant into database",
                          err
                        );
                        res
                          .status(400)
                          .send("unable to insert restaurant into database");
                      } else {
                        console.log("restaurant added");
                        status =
                          status + "Successfully inserted restaurant in DB";
                        res.cookie("cookie1", "ownercookie", {
                          maxAge: 900000,
                          httpOnly: false,
                          path: "/"
                        });
                        res.cookie("cookie2", trimemail, {
                          maxAge: 900000,
                          httpOnly: false,
                          path: "/"
                        });
                        res.cookie("cookie3", req.body.firstname, {
                          maxAge: 900000,
                          httpOnly: false,
                          path: "/"
                        });
                        console.log(status);
                        res.status(200).json({ responseMessage: status });
                      }
                    }
                  );
                }
              });
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }
    }
  );
});

// save customer profile details
router.route("/customer/profilesave").post(function(req, res) {
  console.log("In profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  var userData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    phone_number: req.body.phone
  };

  console.log(userData);
  pool.query(
    "UPDATE customers SET ? WHERE email = ?",
    [userData, trimemail],
    function(err) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        res.status(400).json({ responseMessage: "unable to update database" });
      } else {
        pool.query(
          "SELECT * FROM customers WHERE email = ?",
          [trimemail],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({ responseMessage: "User not found" });
            } else {
              res.writeHead(200, { "content-type": "application/json" });
              res.end(JSON.stringify(result));
            }
          }
        );
      }
    }
  );
});

// save owner profile details
router.route("/owner/profilesave").post(function(req, res) {
  console.log("In profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  var ownerData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    phone_number: req.body.phone
  };

  var restaurantData = {
    restaurant_name: req.body.rname,
    cuisine: req.body.cuisine,
    email: trimemail,
    zip_code: req.body.zipcode
  };

  console.log(ownerData);
  pool.query(
    "UPDATE owners SET ? WHERE email = ?",
    [ownerData, trimemail],
    function(err) {
      if (err) {
        console.log(err);
        console.log("unable to update database");
        res.status(400).json({ responseMessage: "unable to update database" });
      } else {
        pool.query(
          "SELECT * FROM owners WHERE email = ?",
          [trimemail],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({ responseMessage: "User not found" });
            } else {
              console.log(restaurantData);
              pool.query(
                "UPDATE restaurants SET ? WHERE email = ?",
                [restaurantData, trimemail],
                function(err) {
                  if (err) {
                    console.log(err);
                    console.log("unable to update database");
                    res
                      .status(400)
                      .json({ responseMessage: "unable to update database" });
                  } else {
                    pool.query(
                      "SELECT * FROM owners JOIN restaurants ON owners.email = restaurants.email WHERE owners.email = ?",
                      [trimemail],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                          res.status(400).json({
                            responseMessage: "Particular restaurant not found"
                          });
                        } else {
                          res.writeHead(200, {
                            "content-type": "application/json"
                          });
                          res.end(JSON.stringify(result));
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );

  console.log(restaurantData);
});

//owner profile fetch
router.route("/owner/profilefetch").post(function(req, res) {
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  pool.query(
    "SELECT * FROM owners JOIN restaurants ON owners.email = restaurants.email WHERE owners.email = ?",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Error while retrieving owner info"
        });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result));
      }
    }
  );
});

//Customer profile fetch

router.route("/customer/profilefetch").post(function(req, res) {
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  pool.query(
    "SELECT * FROM customers WHERE email = ?",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Error while retrieving owner info"
        });
      } else {
        res.writeHead(200, {
          "content-type": "application/json"
        });
        res.end(JSON.stringify(result));
      }
    }
  );
});

module.exports = router;
