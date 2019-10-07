var express = require("express");
var pool = require("../DbConnection");
var router = express.Router();

//update the status of the order
router.route("/owner/orders/updatestatus").post(function(req, res) {
  console.log("In update order status post");

  var updatedStatus = {
    status: req.body.status
  };
  pool.query(
    "UPDATE orders SET ? WHERE order_id = ?",
    [updatedStatus, req.body.order_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Unable to update the order status"
        });
      } else {
        console.log("result of update", result);
        res.status(200).json({
          responseMessage: "Status updated"
        });
      }
    }
  );
});

//get owner's past orders by restaurant id
router.route("/owner/orders/past").get(function(req, res) {
  console.log("In get past orders by restaurant id");
  var restaurantId = req.body.restaurantId;

  pool.query(
    "select * from orders JOIN ordered_items using(order_id) join items using(item_id) where orders.restaurant_id = ? and status in ('delivered', 'canceled') ORDER BY last_modified_on DESC",
    [restaurantId],
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

//get owner's pending orders by restaurant id
router.route("/owner/orders/pending").get(function(req, res) {
  console.log("In get pending orders by restaurant id");
  var restaurantId = req.body.restaurantId;
  pool.query(
    "select * from orders JOIN ordered_items using(order_id) join items using(item_id) where orders.restaurant_id = ? and NOT status in ('delivered', 'canceled') ORDER BY last_modified_on DESC",
    [restaurantId],
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

//get owner's orders by email

router.route("/owner/orders").post(function(req, res) {
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  pool.query(
    "SELECT restaurant_id FROM restaurants WHERE email = ?",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Issue while querying the restaurants table"
        });
      } else {
        var restId = result[0]["restaurant_id"];

        console.log(restId);
        if (restId > 0) {
          pool.query(
            "select * from orders JOIN ordered_items using(order_id) join items using(item_id) where orders.restaurant_id = ?",
            [restId],
            (err, orderInfo) => {
              if (err) {
                console.log(err);
                res.status(400).json({
                  responseMessage: "Unable to find restaurant info"
                });
              } else {
                console.log(orderInfo);
                res.writeHead(200, {
                  "content-type": "application/json"
                });
                res.end(JSON.stringify(orderInfo));
              }
            }
          );
        } else {
          res.status(200).json({
            responseMessage: "Email not available"
          });
        }
      }
    }
  );
});
//get orders without items just with status
router.route("/owner/onlyOrders").post(function(req, res) {
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  pool.query(
    "SELECT restaurant_id FROM restaurants WHERE email = ? ",
    [trimemail],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          responseMessage: "Issue while querying the restaurants table"
        });
      } else {
        var restId = result[0]["restaurant_id"];

        console.log(restId);
        if (restId > 0) {
          pool.query(
            "select * from orders where orders.restaurant_id = ? and NOT status in ('delivered', 'canceled')",
            [restId],
            (err, orderInfo) => {
              if (err) {
                console.log(err);
                res.status(400).json({
                  responseMessage: "Unable to find restaurant info"
                });
              } else {
                console.log(orderInfo);
                res.writeHead(200, {
                  "content-type": "application/json"
                });
                res.end(JSON.stringify(orderInfo));
              }
            }
          );
        } else {
          res.status(200).json({
            responseMessage: "Email not available"
          });
        }
      }
    }
  );
});

module.exports = router;
