var express = require("express");
var pool = require("../DbConnection");
var router = express.Router();

//get restaurant details by email
router.route("/owner/restaurant/getid").post(function(req, res) {
  console.log("In profile save Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  pool.query(
    "SELECT * FROM restaurants WHERE email = ?",
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
});

//Add item
router.route("/owner/menu/insertitem").post(function(req, res) {
  console.log("In owner item update Post");
  console.log(req.body);

  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  pool.query(
    "SELECT * FROM restaurants WHERE email = ?",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Particular restaurant not found"
        });
      } else {
        console.log(result[0].restaurant_id);
        var restaurant_id = result[0].restaurant_id;
        var item_name = req.body.itemName;

        pool.query(
          "SELECT * FROM items WHERE restaurant_id = ? and item_name = ?",
          [restaurant_id, item_name],
          (err, rows) => {
            if (err) {
              console.log(err);
              console.log("unable to read the items database");
              res
                .status(400)
                .json({ responseMessage: "unable to read the items database" });
            } else {
              if (rows.length > 0) {
                console.log(
                  "This item for the given restaurant already exists"
                );
                res.status(400).json({
                  responseMessage:
                    "This item for the given restaurant already exists"
                });
              } else {
                var itemData = {
                  restaurant_id: restaurant_id,
                  item_name: item_name,
                  price: req.body.price,
                  item_description: req.body.itemDescription,
                  section: req.body.itemSection
                };

                //Save the user in database
                pool.query("INSERT INTO items SET ?", itemData, function(
                  err,
                  insertResult
                ) {
                  if (err) {
                    console.log("unable to insert into items database", err);
                    res
                      .status(400)
                      .send("unable to insert into items database");
                  } else {
                    console.log("Item Added", insertResult);
                    res.writeHead(200, {
                      "content-type": "application/json"
                    });
                    res.end(JSON.stringify(insertResult));
                  }
                });
              }
            }
          }
        );
      }
    }
  );
});

//update item info
//need restId and itemId
router.route("/owner/menu/updateitem").post(function(req, res) {
  console.log("In item update Post");

  var itemId = req.body.itemId;
  var restId = req.body.restaurant_id;
  var itemData = {
    restaurant_id: restId,
    item_name: req.body.itemName,
    price: req.body.price,
    item_description: req.body.itemDescription,
    section: req.body.itemSection
  };

  console.log(itemData);
  pool.query(
    "UPDATE items SET ? WHERE restaurant_id = ? and item_id = ?",
    [itemData, restId, itemId],
    function(err) {
      if (err) {
        console.log(err);
        console.log("unable to update items table");
        res
          .status(400)
          .json({ responseMessage: "unable to update items table" });
      } else {
        pool.query(
          "SELECT * FROM items WHERE item_id = ?",
          [itemId],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({ responseMessage: "Item not found" });
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

//delete Item
router.route("/owner/menu/delete").post(function(req, res) {
  var itemId = req.body.itemId;
  pool.query("DELETE FROM items WHERE item_id= ? ", itemId, function(err) {
    if (err) {
      console.log(err);
      console.log("unable to delete item ");
      res.status(400).json({ responseMessage: "unable to delete the item " });
    } else {
      res.status(200).json({ responseMessage: "Item deleted" });
    }
  });
});

//get all the items by restaurant id
router.route("/owner/getAllItemsByRestId").post(function(req, res) {
  console.log("In get items by restaurant id");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  pool.query(
    "SELECT * FROM restaurants WHERE email = ?",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Particular restaurant not found"
        });
      } else {
        console.log(result[0].restaurant_id);
        var restaurant_id = result[0].restaurant_id;

        pool.query(
          "SELECT * FROM items WHERE restaurant_id = ?",
          [restaurant_id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({
                responseMessage: "Unable to fetch details from items table"
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
});

module.exports = router;
