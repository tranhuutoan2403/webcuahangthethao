-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2025 at 03:46 AM
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
(1, 7, 'Trẩn Minh Tiến', '024225525', '123 Võ Văn Vân', 0, '2025-09-16 06:00:08'),
(2, 7, 'Trẩn Minh Tiến', '024225525', '123 Võ Văn Vân', 0, '2025-09-16 06:00:14');

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flash_sales`
--

INSERT INTO `flash_sales` (`flash_sale_id`, `name`, `description`, `discount_type`, `discount_value`, `start_at`, `end_at`, `status`, `created_at`) VALUES
(2, 'Đại Hội Săn Sale', 'Giảm 20% cho tất cả sản phẩm', 'percent', 20, '2025-09-21 10:35:00', '2025-09-22 10:35:00', 'active', '2025-09-20 20:35:54'),
(3, 'Chương Trình Giảm Giá Tháng 11', 'Săn sale ngập tràn ưu đãi', 'percent', 25, '2025-09-23 10:51:00', '2025-09-30 10:51:00', 'active', '2025-09-20 20:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sale_products`
--

DROP TABLE IF EXISTS `flash_sale_products`;
CREATE TABLE IF NOT EXISTS `flash_sale_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `flash_sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `stock_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `flash_sale_id` (`flash_sale_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flash_sale_products`
--

INSERT INTO `flash_sale_products` (`id`, `flash_sale_id`, `product_id`, `stock_limit`, `created_at`) VALUES
(4, 2, 9, 6, '2025-09-20 21:34:15'),
(5, 3, 11, 50, '2025-09-23 10:16:08'),
(6, 3, 3, 60, '2025-09-23 10:23:06');

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`material_id`, `product_id`, `color`, `size`, `sku`, `stock`, `image`, `created_at`) VALUES
(3, 25, 'Đen', '42', 'Giày Nữ Thời Trang-Đen-SIZE-42', 20, 'bongda.JPG', '2025-09-17 05:56:22'),
(8, 25, 'Đen', '44', 'Giày-Nữ-Thời-Trang-Đen-SIZE-44', 50, 'bongda.JPG', '2025-09-17 20:38:02'),
(9, 25, 'Đen', '45', 'Giày-Nữ-Thời-Trang-Đen-SIZE-45', 60, 'bongda.JPG', '2025-09-17 22:27:32'),
(10, 3, NULL, '4U', 'Vợt-Axforce-100-Vàng-Golden-SIZE-4U', 50, NULL, '2025-09-18 06:01:46'),
(11, 25, 'Đen', '39', 'Giày-Nữ-Thời-Trang-Đen-SIZE-39', 60, 'bongda.JPG', '2025-09-18 06:48:18'),
(16, 33, NULL, '4U', 'Vợt-Canno-Pro-SIZE-4U', 60, NULL, '2025-09-18 07:20:13'),
(17, 25, 'Xám', '45', 'Giày-Nữ-Thời-Trang-Xám-SIZE-45', 50, 'giayxam.jpg', '2025-09-23 04:12:44');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `news_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`news_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `category_id`, `title`, `slug`, `content`, `image`, `status`, `published_at`, `created_at`) VALUES
(1, 1, 'Bài Báo Cầu Lông', 'bai-bao-cau-long', 'Tường thuật trực tiếp trận cầu lông diễn ra hôm nay...', 'loitool1.JPG', 'published', '2025-09-22 00:00:00', '2025-09-24 03:10:44'),
(2, 1, 'Tin Khuyến Mãi Đặc Biệt', 'tin-khuyen-mai-dac-biet', 'Giảm giá 50% cho các sản phẩm thể thao...', 'san2.jpg', 'published', '2025-09-24 08:30:00', '2025-09-24 03:10:44'),
(3, 2, 'Về Chúng Tôi', 've-chung-toi', 'Tháng 12/2011, Forum https://www.vnbadminton.com/ được thành lập, đây là website cung cấp những thông tin chuyên nghiệp về tin tức và diễn đàn cầu lông. Nhận thấy sự phát triển của cầu lông trong nước, bên cạnh đó là mong muốn phục vụ tốt hơn cho thành viên và những bạn yêu mến cầu lông. Tháng 12/2012, Ban Quản Trị Vnbadminton đã mạnh dạn xây dựng Shop cầu lông VNB (https://shopvnb.com/) để có thể làm được vai trò này. Với kinh nghiệm nhiều năm hoạt động trong lĩnh vực cầu lông, đến với shopvnb bạn sẽ yên tâm về chất lượng sản phẩm, đội ngũ tư vấn sản phẩm chuyên nghiệp và giá cả hợp lý.\n\nBên cạnh một website chuyên nghiệp thì Shop VNB còn phát triển thêm 1 kênh fanpage https://www.facebook.com/caulongvnbadminton/ để cung cấp thông tin nhanh hơn cho thành viên yêu mến cầu lông. Chính sự chuyên nghiệp này đã được tạo được uy tín rất lớn trong cộng đồng yêu mến cầu lông trong và ngoài nước.\n\nHiện nay, Hệ thống cửa hàng cầu lông VNB đã có hơn 50 chi nhánh trải dài trên khắp mọi miền Đất nước. Với tiêu chí luôn đảm bảo cung cấp đầy đủ các mặt hàng chuyên dụng dành riêng cho bộ môn cầu lông như giày, vợt cầu lông, túi vợt, balo, quần áo, phụ kiện,... nổi trội với nhiều phân khúc giá trải dài từ thấp đến cao nên các lông thủ cần mua gì cứ đến ngay với ShopVNB, chắc chắn sẽ làm các bạn vô cùng hài lòng.\n\nShopVNB luôn là nơi cung cấp nhanh nhất các mặt hàng hot đến từ những thương hiệu top đầu thế giới như Yonex, Lining, Victor, Mizuno,... Không những vậy các sản phẩm đến từ các hãng tầm trung và giá rẻ như Adidas, Forza, Apacs, VNB, Kamito,... Shop cầu lông VNB cũng luôn cung cấp đầy đủ và mẫu mã rất đa dạng.', 'san3.jpg', 'published', '2025-09-13 09:00:00', '2025-09-24 03:10:44'),
(4, 3, 'Hướng Dẫn Thanh Toán Chi Tiết', 'huong-dan-thanh-toan-chi-tiet', 'Các bước thanh toán nhanh chóng và dễ dàng...', 'thanh-toan.png', 'published', '2025-09-15 11:00:00', '2025-09-24 03:10:44'),
(5, 4, 'Chính Sách Bảo Hành', 'chinh-sach-bao-hanh', 'Thông tin chi tiết về chính sách bảo hành sản phẩm...', 'bao-hanh.png', 'published', '2025-09-16 14:30:00', '2025-09-24 03:10:44'),
(6, 1, 'Bài viết Tennis', 'tin-tuc-tennis', 'Chào mừng mọi người đến với buổi tường thuật trực tiếp', 'caycanh.JPG', 'published', '2025-09-24 00:00:00', '2025-09-24 04:00:29');

-- --------------------------------------------------------

--
-- Table structure for table `news_categories`
--

DROP TABLE IF EXISTS `news_categories`;
CREATE TABLE IF NOT EXISTS `news_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_categories`
--

INSERT INTO `news_categories` (`category_id`, `name`, `slug`, `description`, `created_at`) VALUES
(1, 'Tin tức', 'tin-tuc', 'Danh mục các tin tức và bài viết mới nhất', '2025-09-24 03:10:43'),
(2, 'Giới thiệu', 'gioi-thieu', 'Lịch sử thành lập công ty tui', '2025-09-24 03:10:43'),
(3, 'Hướng dẫn thanh toán', 'huong-dan-thanh-toan', 'Các bài viết hướng dẫn khách hàng thanh toán', '2025-09-24 03:10:43'),
(4, 'Hướng dẫn bảo hành', 'huong-dan-bao-hanh', 'Các bài viết về chính sách và quy trình bảo hành', '2025-09-24 03:10:43');

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

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` INT(11) DEFAULT NULL,  -- Thêm cột brand
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
(1, 1, 'Vợt Yonex Astrox 77 Pro Đỏ', 'axtrox-77', 'Vợt cầu lông Yonex chính hãng, nhẹ và bền', 550000, 75, 'astrox-77-pro.jpg', '2025-09-13 07:50:32'),
(2, 1, 'Vợt Yonex Astrox 88d pro', 'axtrox-88', 'Giày thể thao nhẹ, êm ái, thích hợp cho việc chạy bộ hoặc tập gym.', 750000, 120, 'astrox-88d-pro-ch.jpg', '2025-09-13 07:50:32'),
(3, 1, 'Vợt Axforce 100 Vàng Golden', '100-golden', 'Điện thoại thông minh với camera sắc nét, pin dung lượng lớn và thiết kế sang trọng.', 1200000, 80, 'axforce-100-vang-golden.jpg', '2025-09-13 07:50:32'),
(9, 1, 'Vợt Yonex Nanoflare 800 Pro', 'nanaflare-800', 'Vợt rất nhẹ nhàng', 500000, 50, 'nanoflare800.jpg', '2025-09-13 21:12:07'),
(11, 1, 'Vợt Axforce 90 Xanh Dragon', '90-dragon', 'Vợt thiên hướng tấn công toàn diện', 500000, 30, 'axforce-90-xanh-dragon-max.jpg', '2025-09-13 23:10:27'),
(12, 2, 'Vợt Pickle Ball Head Extreme Lite', 'Extreme-Lite', 'Vợt PickelBall Tốt', 400000, 35, 'HeadExtremeElite.jpg', '2025-09-13 23:35:52'),
(14, 2, 'Vợt Pickle Ball Head Radical Lite', 'Radical-lite', 'Vợt Pickel Ball nhẹ nhàng', 600000, 45, 'HeadRadicalElite.jpg', '2025-09-13 23:43:51'),
(15, 2, 'Vợt PickelBall HeadSparkElite', 'Spark-elite', 'Vợt phù hợp cho người mới chơi', 550000, 35, 'HeadSparkElite.jpg', '2025-09-14 00:01:09'),
(25, 10, 'Giày Nữ Thời Trang', 'giay-nu', 'Giày nữ dịu êm ', 750000, 40, 'btnextjx.JPG', '2025-09-17 05:56:22'),
(33, 1, 'Vợt Canno Pro', 'cannon-pro', 'rgrrrry', 850000, 60, 'mubaohiem.JPG', '2025-09-18 07:20:13');

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `brands` (
  `brand_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`name`, `slug`) VALUES
('Yonex', 'yonex'),
('Lining', 'lining'),
('Victor', 'victor');


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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone`, `address`, `role`, `status`, `created_at`) VALUES
(2, 'Tran Thi B', 'b@example.com', '$2b$10$Q9E3hX9M8kKPejNKvR.Yc.1SgDNYDkAZyTt3YUMc3xHcTej8rRj4G', '0987654321', '456 Hai Bà Trưng, Hà Nội', 'user', 'active', '2025-09-13 07:50:31'),
(6, 'HoangPro098', 'hoangsuon012@gmail.com', '$2b$10$CUhoYMk6IUsC6.WqZgXi4uZHzx8.r9iOeTZvGr5ZkWijB4cVSPigW', '0242455231', '123 Nguyễn Cửu Phú', 'user', 'active', '2025-09-15 03:33:12'),
(7, 'MinhTien', 'minhtien@gmail.com', '$2b$10$YETOupHgHuWVijQ0tUexke61uwfTvZtrFVApTP2Ql1qn6TJETRkO2', '0373466151', 'Trần Phú TPHCM', 'user', 'active', '2025-09-15 03:36:18'),
(8, 'PhuocNguyen2034', 'phuoc@gmail.com', '$2b$10$0jmNkB.cE0wsWJtigJSgtOnwHtmSElDjjdiHJQO/M8D.gHFatRAEa', '02425233', 'ng3663631', 'user', 'active', '2025-09-15 03:39:59'),
(13, 'dewq294e1', 'r224242@gmail.com', '$2b$10$ELyrC4NTJ02EbUZGNM0ZWOdykpr6DFDTCA1TG/Trf1CCFlSZ3fyMS', '024211144', 'ff33535', 'user', 'active', '2025-09-15 03:55:11'),
(15, 'ft35352', 'wrw3@gmail.com', '$2b$10$D1A3jzllK/YTQ5dsyS7zQ.hV7.An8yFW2RtOjocbaIoS1HtX5SEpS', '024242111', 'f353535', 'user', 'inactive', '2025-09-15 04:02:39'),
(16, 'TrongLuc', 'trongluc@gmail.com', '$2b$10$qg6g3VHRAWIKgyLZHeWgOONMjtYYEyLlhRNGyirZPgqo1KT07pjQO', '033242424', 'Võ Văn Vân TPHCM', 'admin', 'active', '2025-09-15 07:46:41'),
(17, 'DaiMinh', 'daiminh@gmail.com', '$2b$10$AqCLmsiIIWgmeiHjtiVhpecjwmH1vzaLjIbbX.LCrrzgEwJxHVYsq', '0935352312', '224 An Dương Vương, TPHCM', 'admin', 'active', '2025-09-19 05:42:07'),
(19, 'HuuToan', 'huutoan@gmail.com', '$2b$10$0NxqZD6ImGVZWekDLgaA.ev1RPH65pifo2UldPnFhm2h0W.MGx98u', '045645632', 'Long An', 'admin', 'active', '2025-09-19 06:43:07'),
(20, 'HongDuc', 'hongduc@gmail.com', '$2b$10$yjlsGm58kJmrnFNQUhtF2OqJ/xB59De/Z4lLI4doW/TVTPIIr7PYO', '0965055060', 'Thủ Đức Tphcm', 'user', 'active', '2025-09-20 06:00:18'),
(21, 'HuyNguyen213', 'nguyenhuy9611@gmail.com', '$2b$10$wmixhMSNuKSNeSpohh5UnO.35vkKTBF/GmCMOpQ8lboEVmaaatH9m', '0965055062', 'Can Giuoc Long An', 'user', 'inactive', '2025-09-20 07:15:07'),
(26, 'TommyTeo', 'tommy@gmail.com', '$2b$10$tJsqqYcbqqtvAXLO59HpkeucIT/CbY8bEMevJE8LMz789OGeLrD4C', '0964646242', 'Bến Lức Long An', 'admin', 'active', '2025-09-23 02:43:46');

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
(1, 'SALE10', 'Giảm 10% cho đơn hàng từ 1.000.000 VNĐ trở lên', 'percent', 10, 1000000, 100, 0, '2025-09-01', '2025-09-30', 'active', '2025-09-13 07:50:32'),
(2, 'GIAM50K', 'Giảm 50.000 VNĐ cho đơn từ 200.000 VNĐ', 'fixed', 50000, 200000, 200, 0, '2025-09-01', '2025-09-15', 'active', '2025-09-13 07:50:32');

--
-- Constraints for dumped tables
--
ALTER TABLE `products`
ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`) ON DELETE SET NULL;
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
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `news_categories` (`category_id`) ON DELETE CASCADE;

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
