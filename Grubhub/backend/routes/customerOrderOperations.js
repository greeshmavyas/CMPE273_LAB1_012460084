var express = require("express");
var pool = require("../DbConnection");
var router = express.Router();

//place the order. Need restaurantId, itemId
router.route("/custormer/order").post(function(req, res) {
  console.log("In order Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();

  var orderData = {
    restaurant_id: req.body.restaurantId,
    email: trimemail,
    delivery_address: req.body.deliveryAddress,
    status: "New",
    last_modified_on: today
  };

  pool.query("INSERT INTO orders SET ?", orderData, function(err, result) {
    if (err) {
      console.log("unable to insert the order", err);
      res.status(400).send("unable to insert the order");
    } else {
      console.log("Order Added");

      var ordered_items = req.body.items;
      for (i = 0; i < ordered_items.length; i++) {
        var orderedItemData = {
          order_Id: result.insertId,
          item_Id: ordered_items[i].itemId,
          quantity: ordered_items[i].quantity
        };
        // Save the ordered item
        pool.query("INSERT INTO ordered_items SET ?", orderedItemData, function(
          err
        ) {
          if (err) {
            console.log("unable to insert ordered items", err);
            res.status(400).send("unable to insert ordered items");
          } else {
            console.log("ordered items added");
          }
        });
      }
      res.status(200).json({
        responseMessage: `Successfully placed the order. Order id : ${result.insertId} `
      });
    }
  });
});

//get the upcoming orders
router.route("/custormer/orders/upcoming").post(function(req, res) {
  console.log("In get orders by email id");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  pool.query(
    "select * from orders JOIN ordered_items using(order_id) join items using(item_id) where email = ? and NOT status in ('delivered', 'canceled') ORDER BY last_modified_on DESC",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Unable to fetch the customer's orders"
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

//get the past orders
router.route("/custormer/orders/past").post(function(req, res) {
  console.log("In get orders by email id");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();

  pool.query(
    "select * from orders JOIN ordered_items using(order_id) join items using(item_id) where email = ? and status in ('delivered', 'canceled') ORDER BY last_modified_on DESC",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Unable to fetch the customer's orders"
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
