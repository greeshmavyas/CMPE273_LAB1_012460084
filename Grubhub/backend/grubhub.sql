DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `email` varchar(60) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(10),
  `image_name` varchar(100),
  PRIMARY KEY (`email`)
);

DROP TABLE IF EXISTS `owners`;

CREATE TABLE `owners` (
  `email` varchar(60) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(10),
  `image_name` varchar(100),
  PRIMARY KEY (`email`)
);

DROP TABLE IF EXISTS `restaurants`;

CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(60) NOT NULL,
  `cuisine` varchar(100),
  `restaurant_name` varchar(100) NOT NULL,
  `zip_code` varchar(50),
  `rest_image_name` varchar(100),
  PRIMARY KEY (`restaurant_id`),
  KEY `FK` (`email`)
);

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) NOT NULL,
  `item_name` varchar(60) NOT NULL,
  `price` varchar(100),
  `item_description` varchar(100),
  `section` varchar(100),
  `item_image_name` varchar(100),
  PRIMARY KEY (`item_id`),
  KEY `FK` (`restaurant_id`)
);

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `delivery_address` varchar(200),
  `status` varchar(100) NOT NULL,
  `last_modified_on` varchar(150),
  PRIMARY KEY (`order_id`),
  KEY `FK` (`restaurant_id`, `email`)
);

DROP TABLE IF EXISTS `ordered_items`;

CREATE TABLE `ordered_items` (
  `ordered_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`ordered_item_id`),
  KEY `FK` (`order_id`, `item_id`)
);

