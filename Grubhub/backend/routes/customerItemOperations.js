var express = require("express");
var pool = require("../DbConnection");
var router = express.Router();

//get all the restaurants by item name
router.route("/customer/getRestaurantsByItemName").post(function(req, res) {
  console.log("In  get restaurants by item name");
  var itemName = req.body.itemName;

  pool.query(
    "SELECT restaurant_id FROM items WHERE item_name = ?",
    [itemName],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Issue while querying the items table"
        });
      } else {
        var restIds = [];
        console.log(result);
        for (i = 0; i < result.length; i++) {
          restIds[i] = result[i]["restaurant_id"];
        }
        console.log(restIds);
        if (result.length > 0) {
          pool.query(
            "SELECT * FROM restaurants WHERE restaurant_id in (?)",
            [restIds],
            (err, restInfo) => {
              if (err) {
                console.log(err);
                res.status(400).json({
                  responseMessage: "Unable to find restaurant info"
                });
              } else {
                console.log(restInfo);
                res.writeHead(200, {
                  "content-type": "application/json"
                });
                res.end(JSON.stringify(restInfo));
              }
            }
          );
        } else {
          res.status(200).json({
            responseMessage: "Item not available"
          });
        }
      }
    }
  );
});

//get all the items by restaurant id
router.route("/customer/getAllItemsByRestId").post(function(req, res) {
  console.log("In get items by restaurant id");
  restId = req.body.restaurantId;
  console.log("restid" + restId);
  pool.query(
    "SELECT * FROM items WHERE restaurant_id = ?",
    [restId],
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
});

module.exports = router;
