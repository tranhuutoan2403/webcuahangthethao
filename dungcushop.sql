-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2025 at 04:00 PM
-- Server version: 10.6.22-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dungcushop`
--
CREATE DATABASE IF NOT EXISTS `dungcushop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dungcushop`;

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `user_id`, `recipient_name`, `phone`, `address_line`, `is_default`, `created_at`) VALUES
(1, 7, 'Trẩn Minh Tiến', '024225525', '123 Võ Văn Vân', 0, '2025-09-16 13:00:08'),
(2, 7, 'Trẩn Minh Tiến', '024225525', '123 Võ Văn Vân', 0, '2025-09-16 13:00:14'),
(3, 7, 'Trần Minh Tiến', '092424242', '123 Võ Văn Vân', 0, '2025-09-16 13:00:58'),
(5, 7, 'Trần Minh Tiến', '092424242', '123 Võ Văn Vân', 0, '2025-09-16 13:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `slug`, `HinhAnh`) VALUES
(1, 'Vợt Cầu Lông', 'vot-cau-long', 'votcaulong.jpg'),
(2, 'Vợt PickleBall', 'vot-pickle-ball', 'thietbi.jpg'),
(10, 'Giày Thể Thao', 'giay-the-thao', 'bongda.JPG');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sales`
--

DROP TABLE IF EXISTS `flash_sales`;
CREATE TABLE IF NOT EXISTS `flash_sales` (
  `flash_sale_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,0) NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('scheduled','active','ended','cancelled') DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`flash_sale_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flash_sales`
--

INSERT INTO `flash_sales` (`flash_sale_id`, `name`, `description`, `discount_type`, `discount_value`, `start_at`, `end_at`, `status`, `created_at`) VALUES
(1, 'Flash Sale 9/2025', 'Giảm giá sốc 50% cho sản phẩm', 'percent', 50, '2025-09-20 09:00:00', '2025-09-20 12:00:00', 'scheduled', '2025-09-13 14:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sale_products`
--

DROP TABLE IF EXISTS `flash_sale_products`;
CREATE TABLE IF NOT EXISTS `flash_sale_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `flash_sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sale_price` decimal(10,0) DEFAULT NULL,
  `discount_type` enum('percent','fixed') DEFAULT NULL,
  `discount_value` decimal(10,0) DEFAULT NULL,
  `stock_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `flash_sale_id` (`flash_sale_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flash_sale_products`
--

INSERT INTO `flash_sale_products` (`id`, `flash_sale_id`, `product_id`, `sale_price`, `discount_type`, `discount_value`, `stock_limit`, `created_at`) VALUES
(1, 1, 1, NULL, 'percent', 50, 10, '2025-09-13 14:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `material_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`material_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`material_id`, `product_id`, `color`, `size`, `sku`, `stock`, `image`, `created_at`) VALUES
(3, 25, 'Đen', '42', 'Giày Nữ Thời Trang-Đen-SIZE-42', 20, 'bongda.JPG', '2025-09-17 12:56:22'),
(8, 25, 'Đen', '44', 'Giày-Nữ-Thời-Trang-Đen-SIZE-44', 50, 'bongda.JPG', '2025-09-18 03:38:02'),
(9, 25, 'Đen', '45', 'Giày-Nữ-Thời-Trang-Đen-SIZE-45', 60, 'bongda.JPG', '2025-09-18 05:27:32'),
(10, 3, NULL, '4U', 'Vợt-Axforce-100-Vàng-Golden-SIZE-4U', 50, NULL, '2025-09-18 13:01:46'),
(11, 25, 'Đen', '39', 'Giày-Nữ-Thời-Trang-Đen-SIZE-39', 60, 'bongda.JPG', '2025-09-18 13:48:18'),
(16, 33, NULL, '4U', 'Vợt-Canno-Pro-SIZE-4U', 60, NULL, '2025-09-18 14:20:13');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `news_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` varchar(500) DEFAULT NULL,
  `content` text NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`news_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`),
  KEY `idx_news_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `title`, `slug`, `excerpt`, `content`, `author_id`, `image`, `status`, `published_at`, `created_at`) VALUES
(1, 'Giới thiệu về chúng tôi', 'gioi-thieu-chung-toi', 'Thông tin giới thiệu công ty', '<p>Nội dung giới thiệu chi tiết...</p>', 1, NULL, 'published', '2025-09-13 21:50:33', '2025-09-13 14:50:33');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `address_id` int(11) NOT NULL,
  `total_amount` decimal(10,0) NOT NULL,
  `final_amount` decimal(10,0) NOT NULL,
  `status` enum('pending','paid','shipping','completed','canceled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `address_id` (`address_id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `voucher_id`, `address_id`, `total_amount`, `final_amount`, `status`, `created_at`) VALUES
(1, 7, 1, 5, 1650000, 1485000, 'pending', '2025-09-16 13:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `discount_amount` decimal(10,0) DEFAULT 0,
  `price` decimal(10,0) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_item_id`, `order_id`, `product_id`, `quantity`, `discount_amount`, `price`) VALUES
(1, 1, 1, 3, 0, 550000);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`product_id`),
  KEY `idx_products_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `created_at`) VALUES
(1, 1, 'Vợt Yonex Astrox 77 Pro Đỏ', 'axtrox-77', 'Vợt cầu lông Yonex chính hãng, nhẹ và bền', 550000, 75, 'astrox-77-pro.jpg', '2025-09-13 14:50:32'),
(2, 1, 'Vợt Yonex Astrox 88d pro', 'axtrox-88', 'Giày thể thao nhẹ, êm ái, thích hợp cho việc chạy bộ hoặc tập gym.', 750000, 120, 'astrox-88d-pro-ch.jpg', '2025-09-13 14:50:32'),
(3, 1, 'Vợt Axforce 100 Vàng Golden', '100-golden', 'Điện thoại thông minh với camera sắc nét, pin dung lượng lớn và thiết kế sang trọng.', 1200000, 80, 'axforce-100-vang-golden.jpg', '2025-09-13 14:50:32'),
(9, 1, 'Vợt Yonex Nanoflare 800 Pro', 'nanaflare-800', 'Vợt rất nhẹ nhàng', 500000, 50, 'nanoflare800.jpg', '2025-09-14 04:12:07'),
(11, 1, 'Vợt Axforce 90 Xanh Dragon', '90-dragon', 'Vợt theo hướng thiên công cho ra quả đập cầu uy lực', 50000, 30, 'axforce-90-xanh-dragon-max.jpg', '2025-09-14 06:10:27'),
(12, 2, 'Vợt Pickle Ball Head Extreme Lite', 'Extreme-Lite', 'Vợt PickelBall Tốt', 400000, 35, 'HeadExtremeElite.jpg', '2025-09-14 06:35:52'),
(14, 2, 'Vợt Pickle Ball Head Radical Lite', 'Radical-lite', 'Vợt Pickel Ball nhẹ nhàng', 600000, 45, 'HeadRadicalElite.jpg', '2025-09-14 06:43:51'),
(15, 2, 'Vợt PickelBall HeadSparkElite', 'Spark-elite', 'Vợt phù hợp cho người mới chơi', 550000, 35, 'HeadSparkElite.jpg', '2025-09-14 07:01:09'),
(25, 10, 'Giày Nữ Thời Trang', 'giay-nu', 'Giày nữ dịu êm ', 750000, 40, 'btnextjx.JPG', '2025-09-17 12:56:22'),
(33, 1, 'Vợt Canno Pro', 'cannon-pro', 'rgrrrry', 850000, 60, 'mubaohiem.JPG', '2025-09-18 14:20:13');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(60) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` enum('active','inactive','banned','pending') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone`, `address`, `role`, `status`, `created_at`) VALUES
(1, 'Nguyen Van A1', 'a@example.com', '$2b$10$Q9E3hX9M8kKPejNKvR.Yc.1SgDNYDkAZyTt3YUMc3xHcTej8rRj4G', '0912345678', '123 Lê Lợi, TP.HCM', 'admin', 'active', '2025-09-13 14:50:31'),
(2, 'Tran Thi B', 'b@example.com', '$2b$10$Q9E3hX9M8kKPejNKvR.Yc.1SgDNYDkAZyTt3YUMc3xHcTej8rRj4G', '0987654321', '456 Hai Bà Trưng, Hà Nội', 'user', 'active', '2025-09-13 14:50:31'),
(5, 'QuangDungVip', 'nguyenphamquangdung9611@gmail.com', '$2b$10$Q9E3hX9M8kKPejNKvR.Yc.1SgDNYDkfhhh', '0454646463', '454 Trần Đại Nghĩa', 'user', 'active', '2025-09-14 07:55:42'),
(6, 'HoangPro098', 'hoangsuon012@gmail.com', '$2b$10$CUhoYMk6IUsC6.WqZgXi4uZHzx8.r9iOeTZvGr5ZkWijB4cVSPigW', '0242455231', '123 Nguyễn Cửu Phú', 'user', 'active', '2025-09-15 10:33:12'),
(7, 'MinhTien', 'minhtien@gmail.com', '$2b$10$7bgnN.c313X4fVFcNKXgC.FlmdGbEpvngrD4/pVwJtXr2Dv2Z0.wC', '0373466151', 'Trần Phú TPHCM', 'user', 'active', '2025-09-15 10:36:18'),
(8, 'PhuocNguyen2034', 'phuoc@gmail.com', '$2b$10$0jmNkB.cE0wsWJtigJSgtOnwHtmSElDjjdiHJQO/M8D.gHFatRAEa', '02425233', 'ng3663631', 'user', 'active', '2025-09-15 10:39:59'),
(13, 'dewq294e1', 'r224242@gmail.com', '$2b$10$ELyrC4NTJ02EbUZGNM0ZWOdykpr6DFDTCA1TG/Trf1CCFlSZ3fyMS', '024211144', 'ff33535', 'user', 'active', '2025-09-15 10:55:11'),
(15, 'ft35352', 'wrw3@gmail.com', '$2b$10$D1A3jzllK/YTQ5dsyS7zQ.hV7.An8yFW2RtOjocbaIoS1HtX5SEpS', '024242111', 'f353535', 'user', 'inactive', '2025-09-15 11:02:39'),
(16, 'TrongLuc', 'trongluc@gmail.com', '$2b$10$qg6g3VHRAWIKgyLZHeWgOONMjtYYEyLlhRNGyirZPgqo1KT07pjQO', '033242424', 'Võ Văn Vân TPHCM', 'admin', 'active', '2025-09-15 14:46:41'),
(17, 'DaiMinh', 'daiminh@gmail.com', '$2b$10$AqCLmsiIIWgmeiHjtiVhpecjwmH1vzaLjIbbX.LCrrzgEwJxHVYsq', '0935352312', '224 An Dương Vương, TPHCM', 'admin', 'active', '2025-09-19 12:42:07'),
(19, 'HuuToan', 'huutoan@gmail.com', '$2b$10$0NxqZD6ImGVZWekDLgaA.ev1RPH65pifo2UldPnFhm2h0W.MGx98u', '045645632', 'Long An', 'admin', 'active', '2025-09-19 13:43:07');

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
CREATE TABLE IF NOT EXISTS `voucher` (
  `voucher_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(10,0) NOT NULL,
  `min_order_amount` decimal(10,0) DEFAULT 0,
  `usage_limit` int(11) DEFAULT 1,
  `used_count` int(11) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('scheduled','active','expired','used','disabled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_voucher_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`voucher_id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 'SALE10', 'Giảm 10% cho đơn hàng từ 1.000.000 VNĐ trở lên', 'percent', 10, 1000000, 100, 0, '2025-09-01', '2025-09-30', 'active', '2025-09-13 14:50:32'),
(2, 'GIAM50K', 'Giảm 50.000 VNĐ cho đơn từ 200.000 VNĐ', 'fixed', 50000, 200000, 200, 0, '2025-09-01', '2025-09-15', 'active', '2025-09-13 14:50:32');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `flash_sale_products`
--
ALTER TABLE `flash_sale_products`
  ADD CONSTRAINT `flash_sale_products_ibfk_1` FOREIGN KEY (`flash_sale_id`) REFERENCES `flash_sales` (`flash_sale_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flash_sale_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `fk_materials_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`voucher_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
