-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2025 at 12:22 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `user_id`, `recipient_name`, `phone`, `address_line`, `is_default`, `created_at`) VALUES
(6, 2, 'Nguyen Van Nhàn', '0123456789', '123 Đường ABC', 0, '2025-10-04 14:34:34'),
(7, 6, 'Nguyễn Phạm Quang Dũng', '0909489611', 'TPHCM', 0, '2025-10-05 03:04:45'),
(8, 6, 'Phạm Tấn Khang', '0395353534', 'Vũng Tàu', 0, '2025-10-05 03:07:41'),
(9, 6, 'Trần Quang Thuận ', '035353522', 'Đà Lạt', 0, '2025-10-05 03:11:02'),
(10, 6, 'bfhhf', '036356352', 'nfhr4', 0, '2025-10-05 03:13:55'),
(11, 6, 'nfhrty4', '0353535311', 'fhrr35', 0, '2025-10-05 03:15:44'),
(12, 6, 'Trần Xuân Vinh', '035350022', 'Phan Thiết', 0, '2025-10-05 03:46:05'),
(13, 6, 'Phạm Tấn Hoàng', '039535353', 'Phan Rang', 0, '2025-10-05 03:51:53'),
(14, 6, 'Nguyễn Ngọc Sang', '03535224', 'Tây Ninh', 0, '2025-10-05 03:58:44'),
(15, 6, 'ngh55', '0464633', 'bfhfh', 0, '2025-10-05 10:08:23'),
(16, 6, 'bhfhh', '04646464', 'fghg', 0, '2025-10-05 10:16:54'),
(17, 6, 'fhfhf', '07575443', 'gjgj46', 0, '2025-10-05 10:18:49'),
(18, 6, 'fhfhh', '04646224', 'nghgjh', 0, '2025-10-05 10:20:42'),
(19, 6, 'vnfry', '93536', 'fhfh', 0, '2025-10-05 10:24:02'),
(20, 6, 'ngutget', '93537', 'sfsfsf', 0, '2025-10-06 13:30:38'),
(21, 6, '035353', '09353533', 'sfsfsf', 0, '2025-10-06 14:15:54');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
CREATE TABLE IF NOT EXISTS `brands` (
  `brand_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `slug`) VALUES
(1, 'Yonex', 'yonex'),
(2, 'Lining', 'lining'),
(3, 'Victor', 'victor'),
(4, 'Nike', 'nike'),
(5, 'Head', 'head'),
(6, 'Joola', 'joola');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `slug`) VALUES
(1, 'Vợt Cầu Lông', 'vot-cau-long'),
(2, 'Vợt PickleBall', 'vot-pickle-ball'),
(10, 'Giày Cầu Lông', 'giay-cau-long');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`feedback_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `user_id`, `name`, `email`, `phone`, `message`, `created_at`) VALUES
(1, 6, 'Nguyễn Văn A', 'nguyenvana@example.com', '0905123456', 'Trang web rất dễ sử dụng, tôi rất hài lòng.', '2025-10-19 03:26:31');

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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`material_id`, `product_id`, `color`, `size`, `sku`, `stock`, `image`, `created_at`) VALUES
(3, 25, 'Đen', '42', 'Giày Nữ Thời Trang-Đen-SIZE-42', 0, 'bongda.JPG', '2025-09-17 05:56:22'),
(8, 25, 'Đen', '44', 'Giày-Nữ-Thời-Trang-Đen-SIZE-44', 50, 'bongda.JPG', '2025-09-17 20:38:02'),
(9, 25, 'Đen', '45', 'Giày-Nữ-Thời-Trang-Đen-SIZE-45', 60, 'bongda.JPG', '2025-09-17 22:27:32'),
(10, 3, NULL, '4U', 'Vợt-Axforce-100-Vàng-Golden-SIZE-4U', 50, NULL, '2025-09-18 06:01:46'),
(11, 25, 'Đen', '39', 'Giày-Nữ-Thời-Trang-Đen-SIZE-39', 60, 'bongda.JPG', '2025-09-18 06:48:18'),
(16, 33, NULL, '4U', 'Vợt-Canno-Pro-SIZE-4U', 60, NULL, '2025-09-18 07:20:13'),
(17, 25, 'Xám', '45', 'Giày-Nữ-Thời-Trang-Xám-SIZE-45', 48, 'giayxam.jpg', '2025-09-23 04:12:44');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_id`, `category_id`, `title`, `slug`, `content`, `image`, `status`, `published_at`, `created_at`) VALUES
(1, 1, 'Khuyến mãi lớn cuối năm', 'khuyen-mai-lon-cuoi-nam', 'Giảm giá 50% tất cả sản phẩm...', 'sale.jpg', 'published', '2025-09-25 10:00:00', '2025-10-04 14:34:35'),
(2, 2, 'Giải cầu lông mở rộng 2025', 'giai-cau-long-mo-rong-2025', 'Thông tin về giải cầu lông toàn quốc...', 'caulong.jpg', 'published', '2025-09-20 09:00:00', '2025-10-04 14:34:35'),
(3, 3, 'Tips chọn giày cầu lông', 'tips-chon-giay-cau-long', 'Chia sẻ kinh nghiệm chọn giày...', 'giay.jpg', 'published', '2025-09-18 14:30:00', '2025-10-04 14:34:35'),
(4, 4, 'Cập nhật sản phẩm mới', 'cap-nhat-san-pham-moi', 'Các sản phẩm mới vừa nhập kho...', 'new.jpg', 'published', '2025-09-22 12:00:00', '2025-10-04 14:34:35');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_categories`
--

INSERT INTO `news_categories` (`category_id`, `name`, `slug`, `description`, `created_at`) VALUES
(1, 'Khuyến mãi', 'khuyen-mai', 'Các chương trình khuyến mãi hot', '2025-10-04 14:34:35'),
(2, 'Sự kiện', 'su-kien', 'Tin tức sự kiện thể thao', '2025-10-04 14:34:35'),
(3, 'Blog', 'blog', 'Chia sẻ kiến thức và kinh nghiệm', '2025-10-04 14:34:35'),
(4, 'Tin tức', 'tin-tuc', 'Các tin tức chung về cửa hàng', '2025-10-04 14:34:35');

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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `voucher_id`, `address_id`, `total_amount`, `final_amount`, `status`, `created_at`) VALUES
(2, 2, NULL, 6, 500000, 450000, 'paid', '2025-10-04 14:34:35'),
(3, 6, NULL, 7, 750000, 750000, 'pending', '2025-10-05 03:04:45'),
(4, 6, NULL, 8, 3750000, 3750000, 'pending', '2025-10-05 03:07:41'),
(5, 6, NULL, 9, 2250000, 2250000, 'pending', '2025-10-05 03:11:02'),
(6, 6, NULL, 10, 750000, 750000, 'pending', '2025-10-05 03:13:55'),
(7, 6, NULL, 11, 750000, 750000, 'pending', '2025-10-05 03:15:44'),
(10, 6, NULL, 12, 3750000, 3750000, 'pending', '2025-10-05 03:46:05'),
(11, 6, NULL, 13, 3750000, 3750000, 'pending', '2025-10-05 03:51:53'),
(12, 6, NULL, 14, 3750000, 3750000, 'pending', '2025-10-05 03:58:44'),
(13, 6, NULL, 15, 3750000, 3750000, 'pending', '2025-10-05 10:08:23'),
(14, 6, NULL, 16, 3750000, 3750000, 'pending', '2025-10-05 10:16:54'),
(15, 6, NULL, 17, 3750000, 3750000, 'pending', '2025-10-05 10:18:49'),
(16, 6, NULL, 18, 750000, 750000, 'pending', '2025-10-05 10:20:42'),
(17, 6, NULL, 19, 750000, 750000, 'pending', '2025-10-05 10:24:02'),
(18, 6, NULL, 20, 2250000, 2250000, 'pending', '2025-10-06 13:30:38'),
(19, 6, NULL, 21, 1500000, 1500000, 'pending', '2025-10-06 14:15:54');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `discount_amount` decimal(10,0) DEFAULT 0,
  `price` decimal(10,0) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `order_details_ibfk_3` (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_item_id`, `order_id`, `product_id`, `material_id`, `quantity`, `discount_amount`, `price`) VALUES
(2, 2, 2, NULL, 2, 0, 200000),
(3, 3, 25, NULL, 1, 0, 750000),
(4, 4, 25, NULL, 5, 0, 750000),
(5, 5, 25, NULL, 3, 0, 750000),
(6, 6, 2, NULL, 1, 0, 750000),
(7, 7, 2, NULL, 1, 0, 750000),
(8, 10, 25, NULL, 5, 0, 750000),
(9, 11, 25, NULL, 5, 0, 750000),
(10, 12, 25, NULL, 5, 0, 750000),
(11, 13, 25, NULL, 5, 0, 750000),
(12, 14, 25, NULL, 5, 0, 750000),
(13, 15, 25, NULL, 5, 0, 750000),
(14, 16, 25, NULL, 1, 0, 750000),
(15, 17, 25, NULL, 1, 0, 750000),
(16, 18, 25, NULL, 3, 0, 750000),
(17, 19, 25, 17, 2, 0, 750000);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `title`, `slug`, `content`, `image`, `status`, `created_at`) VALUES
(1, 'Giới Thiệu', 'gioi-thieu', 'Đây là trang giới thiệu về công ty / cửa hàng...', 'gioi-thieu.jpg', 'published', '2025-10-04 14:34:35'),
(2, 'Hướng Dẫn Mua Hàng', 'huong-dan-mua-hang', 'Các bước chi tiết để mua hàng tại website...', 'mua-hang.jpg', 'published', '2025-10-04 14:34:35'),
(3, 'Hướng Dẫn Thanh Toán', 'huong-dan-thanh-toan', 'Hướng dẫn các phương thức thanh toán...', 'thanh-toan.jpg', 'published', '2025-10-04 14:34:35'),
(4, 'Chính Sách Bảo Hành', 'chinh-sach-bao-hanh', 'Chi tiết chính sách bảo hành sản phẩm...', 'bao-hanh.jpg', 'published', '2025-10-04 14:34:35');

-- --------------------------------------------------------

--
-- Table structure for table `preorders`
--

DROP TABLE IF EXISTS `preorders`;
CREATE TABLE IF NOT EXISTS `preorders` (
  `preorder_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(12,2) GENERATED ALWAYS AS (`price` * `quantity`) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`preorder_id`),
  KEY `idx_preorders_product` (`product_id`),
  KEY `idx_preorders_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`product_id`),
  KEY `idx_products_category` (`category_id`),
  KEY `fk_products_brand` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `brand_id`, `name`, `slug`, `description`, `price`, `image`, `created_at`) VALUES
(1, 1, 1, 'Vợt Yonex Astrox 77 Pro Đỏ', 'axtrox-77', 'Vợt tấn công bùng nổ', 550000, 'astrox-77-pro.jpg', '2025-09-13 07:50:32'),
(2, 1, 1, 'Vợt Yonex Astrox 88d pro', 'axtrox-88', 'Giày thể thao nhẹ, êm ái, thích hợp cho việc chạy bộ hoặc tập gym.', 750000, 'astrox-88d-pro-ch.jpg', '2025-09-13 07:50:32'),
(3, 1, 2, 'Vợt Axforce 100 Vàng Golden', '100-golden', 'Điện thoại thông minh với camera sắc nét, pin dung lượng lớn và thiết kế sang trọng.', 1200000, 'axforce-100-vang-golden.jpg', '2025-09-13 07:50:32'),
(9, 1, 1, 'Vợt Yonex Nanoflare 800 Pro', 'nanaflare-800', 'Vợt rất nhẹ nhàng', 500000, 'nanoflare800.jpg', '2025-09-13 21:12:07'),
(11, 1, 2, 'Vợt Axforce 90 Xanh Dragon', '90-dragon', 'Vợt thiên hướng tấn công toàn diện', 500000, 'axforce-90-xanh-dragon-max.jpg', '2025-09-13 23:10:27'),
(12, 2, 5, 'Vợt Pickle Ball Head Extreme Lite', 'Extreme-Lite', 'Vợt PickelBall Tốt', 400000, 'HeadExtremeElite.jpg', '2025-09-13 23:35:52'),
(14, 2, 5, 'Vợt Pickle Ball Head Radical Lite', 'Radical-lite', 'Vợt Pickel Ball nhẹ nhàng', 600000, 'HeadRadicalElite.jpg', '2025-09-13 23:43:51'),
(15, 2, 5, 'Vợt PickelBall HeadSparkElite', 'Spark-elite', 'Vợt phù hợp cho người mới chơi', 550000, 'HeadSparkElite.jpg', '2025-09-14 00:01:09'),
(25, 10, 5, 'Giày Nữ Thời Trang', 'giay-nu', 'Giày nữ dịu êm', 750000, 'bongda.JPG', '2025-09-17 05:56:22'),
(37, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour VA', 'vot-cau-long-yonex-astrox-100-tour-va', 'Vợt cầu lông Yonex Astrox 100 Tour VA là một trong những siêu phẩm mới nhất mà Yonex vừa giới thiệu, kế thừa trọn vẹn tinh hoa công nghệ của dòng Astrox – biểu tượng của lối chơi tấn công mạnh mẽ với những cú đập cầu uy lực và góc đánh hiểm hóc. Đây là phiên bản giới hạn với bộ nhận diện riêng về màu sắc và thương hiệu, được áp dụng cho toàn bộ dòng Astrox 100 VA. So với bản gốc, Astrox 100 Tour VA vẫn giữ trọn tinh thần của nhà vô địch nhưng ở mức giá dễ tiếp cận hơn, phù hợp cho người chơi muốn trải nghiệm hiệu suất thi đấu ở đẳng cấp cao.', 4469000, 'vot-cau-long-yonex-astrox-100-tour-va.webp', '2025-10-04 08:02:10'),
(38, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Play 2025', 'vot-cau-long-yonex-astrox-99-play-2025', '- Vợt cầu lông Yonex Astrox 99 Play 2025 dù là phiên bản tầm thấp nhất trong dòng vợt 99 2025 này, nhưng vợt vẫn được trang bị công nghệ sở hữu Rotational Generator System cải tiến, phân bổ trọng lượng trên đầu cán vợt, đỉnh khung vợt và khớp nối, mang lại những pha chuyển tiếp liền mạch và những pha tấn công liên tục.', 1769000, 'vot-cau-long-yonex-astrox-99-play-2025.webp', '2025-10-04 09:35:34'),
(39, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour 2025', 'vot-cau-long-yonex-astrox-99-tour-2025', '- Vợt cầu lông Yonex Astrox 99 Tour 2025 hay còn được gọi là 99 Tour Gen 3 với thiết kế lấy cảm hứng từ những thiên thạch va chạm với các hành tinh, tượng trưng cho sức mạnh áp đảo. Phần đế màu đen và xanh lá cây được điểm xuyết bằng họa tiết vân đá cẩm thạch gợi lên sức nặng và sức mạnh, trong khi những vệt màu cam kéo dài từ khung vợt đến tay cầm tượng trưng cho việc truyền tải thông tin cú đánh từ khung vợt đến tay cầm. ', 4359000, 'vot-cau-long-yonex-astrox-100-tour-va.webp', '2025-10-04 09:37:49'),
(40, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ VA', 'vot-cau-long-yonex-astrox-100zz-va', '- Vợt cầu lông Yonex Astrox 100ZZ VA là phiên bản đặc biệt “VA Signature” của dòng Astrox 100ZZ từ Yonex - cây vợt chuyên nghiệp này được thiết kế riêng theo phong cách cá nhân của vận động viên Viktor Axelsen. Nó thể hiện rõ phương châm \"Chúng ta cùng nhau phấn đấu\" của nhà vô địch Olympic. Vợt với màu sắc trắng xanh này là phiên bản giới hạn của mẫu vợt chủ lực thuộc dòng Astrox, với độ cân bằng cao ở đầu vợt và cán vợt cực kỳ cứng cáp, lý tưởng cho những người chơi tìm kiếm sức mạnh và độ chính xác tối đa.', 5329000, 'vot-cau-long-yonex-astrox-100zz-va-grayish-beige-chinh-hang_1758152558.webp', '2025-10-04 09:39:21'),
(41, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Game 2025', 'vot-cau-long-yonex-astrox-99-game-2025', '- Vợt cầu lông Yonex Astrox 99 Game 2025 lấy cảm hứng từ những thiên thạch va chạm với các hành tinh, tượng trưng cho sức mạnh áp đảo. Phần đế màu đen và xanh lá cây được điểm xuyết bằng họa tiết vân đá cẩm thạch gợi lên sức nặng và sức mạnh, trong khi những vệt màu cam kéo dài từ khung vợt đến tay cầm tượng trưng cho việc truyền tải thông tin cú đánh từ khung vợt đến tay cầm.', 2689000, 'vot-cau-long-yonex-astrox-99-game-2025-black-green-chinh-hang_1756252214 (1).webp', '2025-10-04 09:40:19'),
(42, 1, 1, 'Vợt cầu lông Yonex Nanoflare Junior', 'vot-cau-long-yonex-nanoflare-junior', 'Vợt cầu lông Yonex Nanoflare Junior được thiết kế cho lối chơi tốc độ, linh hoạt giữa công và thủ với điểm cân bằng ở mức cân bằng. Đũa vợt siêu dẻo mang lại khả năng trợ lực một cách tối ưu, trọng lượng 4U không quá nặng, thích hợp cho những người mới bắt đầu tập làm quen với bộ môn này hoặc các lông thủ nhí.', 1639000, '1.webp', '2025-10-04 09:42:20'),
(43, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai', 'vot-cau-long-yonex-astrox-100zz-kurenai', 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai nổi trội không chỉ là cây vợt cầu lông cao cấp nhất của nhà Yonex mà em nó còn là một trong những siêu phẩm vợt được sử dụng thành công nhất trên thế giới. Đồng hành cùng Victor Axelsen đăng quang rất nhiều ngôi vô địch trong đó có cả chiếc Huy chương Vàng _Olympic Tokyo 2020. Bên cạnh đó, các tay vợt hàng đầu hiện nay như Akane Yamaguchi, Takuro Hoki, Lakshya Sen cũng đang sử dụng cây vợt này.', 5169000, '2.webp', '2025-10-07 08:01:28'),
(44, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Pro', 'vot-cau-long-yonex-astrox-77-pro', '- Sau khi nhà Yonex cho ra mắt 3 phiên bản gồm Astrox 77 Xanh Dương - Astrox 77 Xanh Chuối và Astrox 77 Đỏ được hầu hết cả vận động viên cùng người chơi phong trào rất ưa chuộng, sử dụng thi đấu siêu thành công thì thương hiệu cầu lông top đầu Nhật Bản đã cho trình làng trên toàn thế giới một siêu phẩm mới với tên gọi đầy đủ là vợt cầu lông Yonex Astrox 77 Pro - Tối ưu hơn trong những pha cầu tốc độ nhanh.', 4138998, '3.webp', '2025-10-07 08:02:40'),
(45, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Pro 2024', 'vot-cau-long-yonex-nanoflare-700-pro-2024', '- Vợt cầu lông Yonex Nanoflare 700 Pro 2024 là phiên bản nâng cấp của dòng Nanoflare 700, thiên về lối chơi linh hoạt, thiên về phản tạt, điều cầu tốc độ nhanh với độ chính xác cao.  - Thiết kế khung được tích hợp công nghệ AERO FRAME được vát tròn để tạo ra cấu trúc khung hình oval để giảm lực cản của không khí để tăng khả năng cơ động để thực hiện những pha phản tạt nhanh. Đũa vợt được làm siêu mỏng nhưng vẫn đảm bảo độ bền cực tốt, là sự lựa chọn phù hợp cho những tay vợt ưa thích tốc độ phản tạt cao.', 1649000, '4.webp', '2025-10-07 08:03:21'),
(46, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Pro', 'vot-cau-long-yonex-astrox-99-pro', 'Vợt cầu lông Yonex Astrox 99 Pro là cây vợt chuyên nghiệp, thuộc dòng Astrox 99 Series, dành cho những người chơi có lối đánh mạnh mẽ, tấn công uy lực. Công nghệ Rotational Generator System giúp phân bổ trọng lượng tối ưu cho từng cú đánh, tăng hiệu suất và chính xác.', 4359000, '5.webp', '2025-10-07 08:04:02'),
(47, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour Pro', 'vot-cau-long-yonex-astrox-99-tour-pro', 'Vợt cầu lông Yonex Astrox 99 Tour Pro với thiết kế mạnh mẽ, giúp phát huy tối đa lực đánh từ người chơi. Độ cứng khung vừa phải giúp các pha đập cầu uy lực nhưng vẫn đảm bảo độ linh hoạt trong những pha phản tạt.', 4359000, '6.webp', '2025-10-07 08:05:10'),
(48, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Pro', 'vot-cau-long-yonex-astrox-100zz-pro', 'Vợt cầu lông Yonex Astrox 100ZZ Pro – phiên bản đặc biệt với trọng lượng cân bằng, phù hợp cho lối đánh toàn diện. Đũa vợt cứng, kết hợp với Rotational Generator System giúp tăng tốc độ và sức mạnh khi đập cầu.', 5329000, '7.webp', '2025-10-07 08:06:20'),
(49, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour', 'vot-cau-long-yonex-astrox-100-tour', 'Vợt cầu lông Yonex Astrox 100 Tour – lý tưởng cho những tay vợt muốn tối ưu sức mạnh và tấn công liên tục. Khung vợt được thiết kế khí động học, đũa vợt cứng, mang lại cảm giác ổn định khi đập cầu.', 4469000, '8.webp', '2025-10-07 08:07:30'),
(50, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Pro', 'vot-cau-long-yonex-astrox-88d-pro', 'Vợt cầu lông Yonex Astrox 88D Pro – chuyên dành cho những người chơi thiên về lối đánh đôi. Khung vợt cứng, trợ lực tốt, giúp phát huy sức mạnh cú đánh, đồng thời vẫn đảm bảo độ chính xác khi phản tạt.', 3989000, '9.webp', '2025-10-07 08:08:40'),
(51, 1, 1, 'Vợt cầu lông Yonex Astrox 88S Pro', 'vot-cau-long-yonex-astrox-88s-pro', 'Vợt cầu lông Yonex Astrox 88S Pro – phù hợp với người chơi đơn, thiên về tốc độ và độ chính xác. Khung nhẹ, trợ lực tốt, giúp kiểm soát cầu tốt trong mọi tình huống.', 3989000, '10.webp', '2025-10-07 08:09:50'),
(52, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800 Pro', 'vot-cau-long-yonex-nanoflare-800-pro', 'Vợt cầu lông Yonex Nanoflare 800 Pro – chuyên dụng cho lối chơi tốc độ nhanh, phản tạt linh hoạt. Khung vợt siêu nhẹ, thiết kế khí động học giúp tối ưu lực đập và điều cầu.', 1749000, '11.webp', '2025-10-07 08:11:00'),
(53, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700FX', 'vot-cau-long-yonex-nanoflare-700fx', 'Vợt cầu lông Yonex Nanoflare 700FX – phiên bản nâng cấp, hỗ trợ lực phản tạt tốt, phù hợp cho người chơi muốn tăng tốc độ cầu và linh hoạt trong các pha đánh.', 1649000, '12.webp', '2025-10-07 08:12:10'),
(54, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour Blue', 'vot-cau-long-yonex-astrox-100-tour-blue', 'Vợt cầu lông Yonex Astrox 100 Tour Blue – phiên bản màu xanh của dòng Astrox 100 Tour, giữ nguyên sức mạnh và độ ổn định, thích hợp cho những cú smash uy lực.', 4469000, '13.webp', '2025-10-07 08:13:20'),
(55, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Xanh Dương', 'vot-cau-long-yonex-astrox-77-xanh-duong', 'Vợt cầu lông Yonex Astrox 77 Xanh Dương – siêu phẩm cho lối đánh tấn công nhanh, độ cứng vừa phải, trợ lực tốt cho những cú đập cầu mạnh.', 4138998, '14.webp', '2025-10-07 08:14:30'),
(56, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Xanh Chuối', 'vot-cau-long-yonex-astrox-77-xanh-chuoi', 'Vợt cầu lông Yonex Astrox 77 Xanh Chuối – thích hợp cho người chơi muốn điều cầu linh hoạt, phối hợp phản tạt và smash nhanh.', 4138998, '15.webp', '2025-10-07 08:15:40'),
(57, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Blue', 'vot-cau-long-yonex-astrox-88d-blue', 'Vợt cầu lông Yonex Astrox 88D Blue – thiết kế khí động học, trợ lực tốt, tối ưu lối đánh đôi, kiểm soát cầu chính xác.', 3989000, '16.webp', '2025-10-07 08:16:50'),
(58, 1, 1, 'Vợt cầu lông Yonex Astrox 88S Red', 'vot-cau-long-yonex-astrox-88s-red', 'Vợt cầu lông Yonex Astrox 88S Red – dành cho lối chơi đơn, nhấn mạnh tốc độ và chính xác. Đũa vợt nhẹ, kiểm soát cầu tốt.', 3989000, '17.webp', '2025-10-07 08:18:00'),
(59, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Light', 'vot-cau-long-yonex-nanoflare-700-light', 'Vợt cầu lông Yonex Nanoflare 700 Light – cực nhẹ, phù hợp với người mới tập và lối chơi phản tạt linh hoạt.', 1639000, '18.webp', '2025-10-07 08:19:10'),
(60, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ White', 'vot-cau-long-yonex-astrox-100zz-white', 'Vợt cầu lông Yonex Astrox 100ZZ White – phiên bản màu trắng, giữ nguyên các công nghệ tối ưu cho lối chơi tấn công và smash mạnh mẽ.', 5329000, '19.webp', '2025-10-07 08:20:20'),
(61, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour Red', 'vot-cau-long-yonex-astrox-99-tour-red', 'Vợt cầu lông Yonex Astrox 99 Tour Red – màu đỏ, thiên về sức mạnh và độ chính xác, hỗ trợ lối đánh tấn công liên tục.', 4359000, '20.webp', '2025-10-07 08:21:30'),
(62, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour Green', 'vot-cau-long-yonex-astrox-100-tour-green', 'Vợt cầu lông Yonex Astrox 100 Tour Green – màu xanh lá, phù hợp lối đánh toàn diện, khung vợt cứng, kiểm soát cầu tốt.', 4469000, '21.webp', '2025-10-07 08:22:40'),
(63, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Pink', 'vot-cau-long-yonex-nanoflare-700-pink', 'Vợt cầu lông Yonex Nanoflare 700 Pink – nhẹ, linh hoạt, thích hợp cho người mới tập và các cú phản tạt nhanh.', 1639000, '22.webp', '2025-10-07 08:23:50'),
(64, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Pro Red', 'vot-cau-long-yonex-astrox-77-pro-red', 'Vợt cầu lông Yonex Astrox 77 Pro Red – dành cho người chơi tấn công, trợ lực tốt, tạo cú smash uy lực.', 4138998, '23.webp', '2025-10-07 08:25:00'),
(65, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800 Light', 'vot-cau-long-yonex-nanoflare-800-light', 'Vợt cầu lông Yonex Nanoflare 800 Light – cực nhẹ, phản tạt nhanh, phù hợp cho lối chơi tốc độ.', 1749000, '24.webp', '2025-10-07 08:26:10'),
(66, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Black', 'vot-cau-long-yonex-astrox-88d-black', 'Vợt cầu lông Yonex Astrox 88D Black – tối ưu cho đôi, trợ lực tốt, kiểm soát cầu chính xác.', 3989000, '25.webp', '2025-10-07 08:27:20'),
(67, 1, 1, 'Vợt cầu lông Yonex Astrox 88S Blue', 'vot-cau-long-yonex-astrox-88s-blue', 'Vợt cầu lông Yonex Astrox 88S Blue – dành cho lối chơi đơn, nhấn mạnh tốc độ và chính xác, khung nhẹ, trợ lực tốt.', 3989000, '26.webp', '2025-10-07 08:28:30'),
(68, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700FX Green', 'vot-cau-long-yonex-nanoflare-700fx-green', 'Vợt cầu lông Yonex Nanoflare 700FX Green – nâng cấp lực phản tạt, tối ưu tốc độ và linh hoạt.', 1649000, '27.webp', '2025-10-07 08:29:40'),
(69, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai Red', 'vot-cau-long-yonex-astrox-100zz-kurenai-red', 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai Red – siêu phẩm, thiên về sức mạnh, được Viktor Axelsen và nhiều VĐV hàng đầu sử dụng.', 5169000, '28.webp', '2025-10-07 08:30:50'),
(70, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Pro Blue', 'vot-cau-long-yonex-astrox-77-pro-blue', 'Vợt cầu lông Yonex Astrox 77 Pro Blue – dành cho người chơi tấn công, khung cứng, hỗ trợ cú smash uy lực.', 4138998, '29.webp', '2025-10-07 08:32:00'),
(71, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Game Red', 'vot-cau-long-yonex-astrox-99-game-red', 'Vợt cầu lông Yonex Astrox 99 Game Red – màu đỏ, phù hợp cho lối đánh mạnh mẽ, liên tục, trợ lực tốt.', 2689000, '30.webp', '2025-10-07 08:33:10'),
(72, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Pro Blue', 'vot-cau-long-yonex-astrox-99-pro-blue', 'Vợt cầu lông Yonex Astrox 99 Pro Blue – chuyên nghiệp, tối ưu cho lối chơi mạnh mẽ, Rotational Generator System giúp tăng hiệu suất và chính xác.', 4359000, '31.webp', '2025-10-07 08:34:20'),
(73, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour Red', 'vot-cau-long-yonex-astrox-100-tour-red', 'Vợt cầu lông Yonex Astrox 100 Tour Red – màu đỏ, lối chơi toàn diện, khung cứng, hỗ trợ các cú smash uy lực.', 4469000, '32.webp', '2025-10-07 08:35:30'),
(74, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800 Pro Pink', 'vot-cau-long-yonex-nanoflare-800-pro-pink', 'Vợt cầu lông Yonex Nanoflare 800 Pro Pink – lối chơi tốc độ, phản tạt linh hoạt, cực nhẹ và kiểm soát cầu tốt.', 1749000, '33.webp', '2025-10-07 08:36:40'),
(75, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Green', 'vot-cau-long-yonex-astrox-88d-green', 'Vợt cầu lông Yonex Astrox 88D Green – tối ưu cho đôi, trợ lực tốt, kiểm soát cầu chính xác.', 3989000, '34.webp', '2025-10-07 08:37:50'),
(76, 1, 1, 'Vợt cầu lông Yonex Astrox 88S Black', 'vot-cau-long-yonex-astrox-88s-black', 'Vợt cầu lông Yonex Astrox 88S Black – dành cho lối chơi đơn, nhấn mạnh tốc độ và chính xác, khung nhẹ, trợ lực tốt.', 3989000, '35.webp', '2025-10-07 08:39:00'),
(77, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Light Blue', 'vot-cau-long-yonex-nanoflare-700-light-blue', 'Vợt cầu lông Yonex Nanoflare 700 Light Blue – cực nhẹ, phản tạt nhanh, thích hợp cho lối chơi tốc độ.', 1639000, '36.webp', '2025-10-07 08:40:10'),
(78, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ White Blue', 'vot-cau-long-yonex-astrox-100zz-white-blue', 'Vợt cầu lông Yonex Astrox 100ZZ White Blue – phiên bản màu trắng xanh, tối ưu lối chơi tấn công và smash mạnh mẽ.', 5329000, '37.webp', '2025-10-07 08:41:20'),
(79, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour Black', 'vot-cau-long-yonex-astrox-99-tour-black', 'Vợt cầu lông Yonex Astrox 99 Tour Black – màu đen, thiên về sức mạnh và độ chính xác, hỗ trợ lối đánh tấn công liên tục.', 4359000, '38.webp', '2025-10-07 08:42:30'),
(80, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour Black', 'vot-cau-long-yonex-astrox-100-tour-black', 'Vợt cầu lông Yonex Astrox 100 Tour Black – khung cứng, trợ lực tốt, tối ưu cho lối đánh toàn diện.', 4469000, '39.webp', '2025-10-07 08:43:40'),
(81, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800 Light Pink', 'vot-cau-long-yonex-nanoflare-800-light-pink', 'Vợt cầu lông Yonex Nanoflare 800 Light Pink – cực nhẹ, phản tạt nhanh, thích hợp cho lối chơi tốc độ.', 1749000, '40.webp', '2025-10-07 08:44:50'),
(82, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Pro Blue', 'vot-cau-long-yonex-astrox-88d-pro-blue', 'Vợt cầu lông Yonex Astrox 88D Pro Blue – tối ưu cho đôi, trợ lực tốt, kiểm soát cầu chính xác.', 3989000, '41.webp', '2025-10-07 08:46:00'),
(83, 1, 1, 'Vợt cầu lông Yonex Astrox 88S Pro Red', 'vot-cau-long-yonex-astrox-88s-pro-red', 'Vợt cầu lông Yonex Astrox 88S Pro Red – dành cho lối chơi đơn, nhấn mạnh tốc độ và chính xác.', 3989000, '42.webp', '2025-10-07 08:47:10'),
(84, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700FX Pink', 'vot-cau-long-yonex-nanoflare-700fx-pink', 'Vợt cầu lông Yonex Nanoflare 700FX Pink – nâng cấp lực phản tạt, tối ưu tốc độ và linh hoạt.', 1649000, '43.webp', '2025-10-07 08:48:20'),
(85, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ VA Red', 'vot-cau-long-yonex-astrox-100zz-va-red', 'Vợt cầu lông Yonex Astrox 100ZZ VA Red – phiên bản đặc biệt VA, màu đỏ, cân bằng lực đánh, tối ưu lối chơi tấn công và smash mạnh mẽ.', 5329000, '44.webp', '2025-10-07 08:49:30'),
(86, 2, 6, 'Vợt Pickleball Joola Perseus 3S Dual 16mm chính hãng', 'vot-pickleball-joola-perseus-3s-dual-16mm-chinh-hang', '- Vợt Pickleball Joola Perseus 3S Dual 16mm được thiết kế dựa trên nền tảng của dòng sản phẩm 3S của JOOLA, Perseus 3S Dual 16mm có cùng hình dáng Perseus được yêu thích với quy trình đảm bảo chất lượng toàn diện để đáp ứng các tiêu chuẩn UPA-A và USAP hiện hành...', 5290000, '54.webp', '2025-10-14 07:01:46'),
(87, 2, 6, 'Vợt Pickleball Joola Perseus 3S Dual 14mm chính hãng', 'vot-pickleball-joola-perseus-3s-dual-14mm-chinh-hang', '- Vợt Pickleball Joola Perseus 3S Dual 14mm được thiết kế dựa trên nền tảng của dòng sản phẩm 3S của JOOLA...', 5290000, '54.webp', '2025-10-14 07:02:31'),
(88, 2, 6, 'Vợt Pickleball Joola Scorpeus 3S Dual 14mm chính hãng', 'vot-pickleball-joola-scorpeus-3s-dual-14mm-chinh-hang', '- Vợt Pickleball Joola Scorpeus 3S Dual 14mm chính hãng được thiết kế dựa trên nền tảng của dòng sản phẩm 3S...', 5290000, '55.webp', '2025-10-14 07:03:12'),
(89, 2, 6, 'Vợt Pickleball Joola Hyperion 3S Dual 16mm chính hãng', 'vot-pickleball-joola-hyperion-3s-dual-16mm-chinh-hang', '- Vợt Pickleball Joola Hyperion 3S Dual 16mm đã được thử nghiệm...', 5290000, '56.webp', '2025-10-14 07:03:56'),
(90, 2, 6, 'Vợt Pickleball Joola Hyperion 3S Dual 16mm chính hãng', 'vot-pickleball-joola-hyperion-3s-dual-16mm-chinh-hang-2', '- Vợt Pickleball Joola Hyperion 3S Dual 16mm đã được thử nghiệm...', 5282001, '57.webp', '2025-10-14 07:04:54'),
(91, 2, 6, 'Vợt Pickleball Joola Ben Johns Hyperion Pro IV 16mm chính hãng', 'vot-pickleball-joola-ben-johns-hyperion-pro-iv-16mm-chinh-hang', '- Hình dạng khí động học của Vợt Pickleball Joola Ben Johns Hyperion Pro IV 16mm...', 5283000, '58.webp', '2025-10-14 07:05:45'),
(92, 2, 6, 'Vợt Pickleball Joola Collin Johns Scorpeus Pro IV 16mm chính hãng', 'vot-pickleball-joola-collin-johns-scorpeus-pro-iv-16mm-chinh-hang', '- Vợt Pickleball Joola Collin Johns Scorpeus Pro IV 16mm chính hãng...', 5283000, '59.webp', '2025-10-14 07:06:25'),
(93, 2, 6, 'Vợt Pickleball Joola Perseus Pro IV 14mm - Asia Colorway chính hãng', 'vot-pickleball-joola-perseus-pro-iv-14mm-asia-colorway-chinh-hang', '- Vợt Pickleball Joola Perseus Pro IV 14mm - Asia Colorway đã nhanh chóng...', 7900000, '60.webp', '2025-10-14 07:07:15'),
(94, 2, 6, 'Vợt Pickleball Joola Perseus Pro IV 16mm - Asia Colorway chính hãng', 'vot-pickleball-joola-perseus-pro-iv-16mm-asia-colorway-chinh-hang', '- Vợt Pickleball Joola Perseus Pro IV 16mm - Asia Colorway chính hãng...', 7990000, '60.webp', '2025-10-14 07:08:17'),
(95, 2, 6, 'Vợt Pickleball Joola Hyperion Pro IV 16mm - Asia Colorway chính hãng', 'vot-pickleball-joola-hyperion-pro-iv-16mm-asia-colorway-chinh-hang', '- Vợt Pickleball Joola Hyperion Pro IV 16mm - Asia Colorway đây là một thiết kế ấn tượng...', 7990000, '61.webp', '2025-10-14 07:08:57'),
(96, 10, 1, 'Giày cầu lông Yonex SHB 65X VA - Grayish Beige chính hãng', 'giay-cau-long-yonex-shb-65x-va-grayish-beige-chinh-hang', '- Giày cầu lông Yonex SHB 65X VA - Grayish Beige mang đậm dấu ấn...', 1809000, '62.webp', '2025-10-14 07:25:08'),
(97, 10, 1, 'Giày cầu lông Yonex Hexis', 'giay-cau-long-yonex-hexis', '- Giày cầu lông Yonex Hexis là mẫu giày mới được Yonex ra mắt...', 699000, '63.webp', '2025-10-14 07:27:50'),
(98, 10, 1, 'Giày cầu lông Yonex Voltrex', 'giay-cau-long-yonex-voltrex', '- Giày cầu lông Yonex Voltrex ghi điểm thực sự lại nằm ở trọng lượng nhẹ...', 699000, '64.webp', '2025-10-14 07:28:33'),
(99, 10, 1, 'Giày cầu lông Yonex SHB 470CR', 'giay-cau-long-yonex-shb-470cr', '- Giày cầu lông Yonex SHB 470CR là dòng giày của Yonex luôn nổi tiếng...', 1699000, '65.webp', '2025-10-14 07:29:16'),
(100, 10, 1, 'Giày cầu lông Yonex 88 Dial 3 2025', 'giay-cau-long-yonex-88-dial-3-2025', '- Giày cầu lông Yonex 88 Dial 3 2025 với công nghệ khóa BOA Fit độc quyền...', 2790000, '66.webp', '2025-10-14 07:30:12'),
(101, 10, 1, 'Giày cầu lông Yonex 88 Dial 3 Wide 2025', 'giay-cau-long-yonex-88-dial-3-wide-2025', '- Giày cầu lông Yonex 88 Dial 3 Wide 2025 với công nghệ khóa BOA Fit...', 2790000, '67.webp', '2025-10-14 07:30:55'),
(102, 10, 1, 'Giày cầu lông Yonex Pyro', 'giay-cau-long-yonex-pyro', '- Giày cầu lông Yonex Pyro là lựa chọn mới mẻ và đầy đột phá...', 686920, '68.webp', '2025-10-14 07:31:42'),
(103, 10, 1, 'Giày cầu lông Yonex Atlas 4', 'giay-cau-long-yonex-atlas-4', '- Giày cầu lông Yonex Atlas 4 là dòng giày cầu lông của Yonex...', 690000, '69.webp', '2025-10-14 07:32:50'),
(104, 10, 2, 'Giày cầu lông Lining AYTV029-1 chính hãng', 'giay-cau-long-lining-aytv029-1-chinh-hang', '- Giày cầu lông Lining AYTV029-1 được thiết kế theo phong cách thể thao...', 1130000, '70.webp', '2025-10-14 07:34:23'),
(105, 10, 2, 'Giày cầu lông Lining AYTU001-7 chính hãng', 'giay-cau-long-lining-aytu001-7-chinh-hang', '- Giày cầu lông Lining AYTU001-7 là sản phẩm trung cấp của thương hiệu Lining...', 1200000, '72.webp', '2025-10-14 07:35:05'),
(106, 10, 2, 'Giày cầu lông Lining AYTU025-1 chính hãng', 'giay-cau-long-lining-aytu025-1-chinh-hang', '- Giày cầu lông Lining AYTU025-1 sử dụng màu sắc đơn giản và giản dị...', 1200000, '73.webp', '2025-10-14 07:35:48'),
(107, 10, 2, 'Giày cầu lông Lining AYTV003-1', 'giay-cau-long-lining-aytv003-1', '- Giày cầu lông Lining AYTV003-1 là một trong những mẫu giày tầm trung nổi bật...', 1500000, '74.webp', '2025-10-14 07:36:35'),
(108, 10, 2, 'Giày cầu lông Lining AYTV003-1', 'giay-cau-long-lining-aytv003-1-2', '- Giày cầu lông Lining AYTV003-1 là một trong những mẫu giày tầm trung nổi bật...', 1500000, '75.webp', '2025-10-14 07:37:34'),
(109, 10, 2, 'Giày cầu lông Lining AYZV001-2 chính hãng', 'giay-cau-long-lining-ayzv001-2-chinh-hang', '- Giày cầu lông Lining AYZV001-2 chính hãng là một trong những mẫu giày tầm trung...', 2119000, '76.webp', '2025-10-14 07:38:21'),
(110, 10, 2, 'Giày cầu lông Lining AYTV015-3 chính hãng', 'giay-cau-long-lining-aytv015-3-chinh-hang', '- Giày cầu lông Lining AYTV015-3 là một đôi giày tập luyện cầu lông đa năng...', 1690000, '77.webp', '2025-10-14 07:39:08'),
(111, 10, 2, 'Giày cầu lông Lining AYTU001-9 chính hãng', 'giay-cau-long-lining-aytu001-9-chinh-hang', '- Giày cầu lông Lining AYTU001-9 được thiết kế với tông màu đơn giản...', 1200000, '78.webp', '2025-10-14 07:40:28'),
(112, 10, 2, 'Giày cầu lông Lining AYTU001-8 chính hãng', 'giay-cau-long-lining-aytu001-8-chinh-hang', '- Giày cầu lông Lining AYTU001-8 là phiên bản nâng cấp vượt trội...', 1200000, '79.webp', '2025-10-14 07:41:16'),
(113, 10, 2, 'Giày cầu lông Lining AYTV027-1 chính hãng', 'giay-cau-long-lining-aytv027-1-chinh-hang', '- Giày cầu lông Lining AYTV027-1 chính hãng là phiên bản nâng cấp vượt trội...', 1200000, '80.webp', '2025-10-14 07:42:02'),
(114, 1, 2, 'Vợt cầu lông Lining Halbertec 1000', 'vt-cu-lng-lining-halbertec-1000', '', 879999, 'lining-1.jpg', '2025-10-21 09:19:44'),
(115, 1, 2, 'Vợt cầu lông Lining Halbertec Motor Pro chính hãng', 'vt-cu-lng-lining-halbertec-motor-pro-chnh-hng', '', 2100000, 'lining-2.jpg', '2025-10-21 09:21:49'),
(116, 1, 2, 'Vợt cầu lông Lining Aeronaut 6000C', 'vt-cu-lng-lining-aeronaut-6000c', '', 1950000, 'lining-3.jpg', '2025-10-21 09:23:56'),
(117, 1, 2, 'Vợt cầu lông Lining Aeronaut 6000', 'vt-cu-lng-lining-aeronaut-6000', '', 1950000, 'lining-4.jpg', '2025-10-21 09:25:18'),
(118, 1, 2, 'Vợt Cầu Lông Lining Turbo Charging Marshal', 'vt-cu-lng-lining-turbo-charging-marshal', '', 1850000, 'lining-5.jpg', '2025-10-21 09:27:28'),
(119, 1, 2, 'Vợt cầu lông Lining Halbertec 4000', 'vt-cu-lng-lining-halbertec-4000', '', 2070000, 'lining-6.jpeg', '2025-10-21 09:29:11'),
(120, 1, 2, 'Vợt cầu lông Lining Aeronaut 6000I', 'vt-cu-lng-lining-aeronaut-6000i', '', 2090000, 'lining-7.jpg', '2025-10-21 09:30:35'),
(121, 1, 2, 'Vợt cầu lông Lining Bladex 500', 'vt-cu-lng-lining-bladex-500', '', 2400000, 'lining-8.jpg', '2025-10-21 09:32:19'),
(122, 1, 2, 'Vợt Cầu Lông Lining Axforce Cannon Pro', 'vt-cu-lng-lining-axforce-cannon-pro', '', 1970000, 'lining9.jpg', '2025-10-21 09:34:17'),
(123, 1, 2, 'Vợt cầu lông Lining Windstorm 72 Power', 'vt-cu-lng-lining-windstorm-72-power', '', 2450000, 'lining 10.jpg', '2025-10-21 09:35:43');

--
-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `created_at`) VALUES
(1, 6, 3, 5, 'Sản phẩm rất tốt chất lượng vượt mong đợi!', '2025-10-19 03:26:30');

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone`, `address`, `role`, `status`, `created_at`) VALUES
(2, 'Tran Thi B', 'b@example.com', '$2b$10$u4Ne8lT8RZky3pGzJsygaOFnXoSXgjnBvwmE0vUjqoOc/kH42W81G', '0987654321', '456 Hai Bà Trưng, Hà Nội', 'user', 'active', '2025-09-13 07:50:31'),
(6, 'HoangPro098', 'hoangsuon012@gmail.com', '$2b$10$CUhoYMk6IUsC6.WqZgXi4uZHzx8.r9iOeTZvGr5ZkWijB4cVSPigW', '0242455231', '123 Nguyễn Cửu Phú', 'user', 'active', '2025-09-15 03:33:12'),
(8, 'PhuocNguyen2034', 'phuoc@gmail.com', '$2b$10$0jmNkB.cE0wsWJtigJSgtOnwHtmSElDjjdiHJQO/M8D.gHFatRAEa', '02425233', 'ng3663631', 'user', 'active', '2025-09-15 03:39:59'),
(13, 'dewq294e1', 'r224242@gmail.com', '$2b$10$ELyrC4NTJ02EbUZGNM0ZWOdykpr6DFDTCA1TG/Trf1CCFlSZ3fyMS', '024211144', 'ff33535', 'user', 'active', '2025-09-15 03:55:11'),
(15, 'ft35352', 'wrw3@gmail.com', '$2b$10$D1A3jzllK/YTQ5dsyS7zQ.hV7.An8yFW2RtOjocbaIoS1HtX5SEpS', '024242111', 'f353535', 'user', 'inactive', '2025-09-15 04:02:39'),
(16, 'TrongLuc', 'trongluc@gmail.com', '$2b$10$qg6g3VHRAWIKgyLZHeWgOONMjtYYEyLlhRNGyirZPgqo1KT07pjQO', '033242424', 'Võ Văn Vân TPHCM', 'admin', 'active', '2025-09-15 07:46:41'),
(17, 'DaiMinh', 'daiminh@gmail.com', '$2b$10$AqCLmsiIIWgmeiHjtiVhpecjwmH1vzaLjIbbX.LCrrzgEwJxHVYsq', '0935352312', '224 An Dương Vương, TPHCM', 'admin', 'active', '2025-09-19 05:42:07'),
(19, 'HuuToan', 'huutoan@gmail.com', '$2b$10$0NxqZD6ImGVZWekDLgaA.ev1RPH65pifo2UldPnFhm2h0W.MGx98u', '045645632', 'Long An', 'admin', 'active', '2025-09-19 06:43:07'),
(20, 'HongDuc', 'hongduc@gmail.com', '$2b$10$yjlsGm58kJmrnFNQUhtF2OqJ/xB59De/Z4lLI4doW/TVTPIIr7PYO', '0965055060', 'Thủ Đức Tphcm', 'user', 'active', '2025-09-20 06:00:18'),
(21, 'HuyNguyen213', 'nguyenhuy9611@gmail.com', '$2b$10$wmixhMSNuKSNeSpohh5UnO.35vkKTBF/GmCMOpQ8lboEVmaaatH9m', '0965055062', 'Can Giuoc Long An', 'user', 'inactive', '2025-09-20 07:15:07'),
(26, 'TommyTeo', 'tommy@gmail.com', '$2b$10$tJsqqYcbqqtvAXLO59HpkeucIT/CbY8bEMevJE8LMz789OGeLrD4C', '0964646242', 'Bến Lức Long An', 'admin', 'active', '2025-09-23 02:43:46'),
(27, 'MinhTien', 'minhtien@gmail.com', '$2b$10$CDILtS1L3wZ6hsQ6dMTUoO1OIAiN2Lg2eewINAyot6GHetrZv71z2', '0373466155', 'Trần Phú TPHCM', 'user', 'active', '2025-09-27 00:43:48');

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
  
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`voucher_id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 'SALE10', 'Giảm 10% cho đơn hàng từ 1.000.000 VNĐ trở lên', 'percent', 10, 1000000, 100, 0, '2025-08-28', '2025-09-26', 'active', '2025-09-13 07:50:32'),
(2, 'GIAM50K', 'Giảm 50.000 VNĐ cho đơn từ 200.000 VNĐ', 'fixed', 50000, 200000, 200, 0, '2025-08-30', '2025-09-13', 'active', '2025-09-13 07:50:32'),
(3, 'FLASH12', 'Đại Tiệc Bùng nổ', 'percent', 20, 700000, 4, 0, '2025-10-14', '2025-10-21', 'active', '2025-10-07 02:04:56');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `fk_materials_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_news_category` FOREIGN KEY (`category_id`) REFERENCES `news_categories` (`category_id`) ON DELETE CASCADE,
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
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_3` FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`) ON DELETE CASCADE;

--
-- Constraints for table `preorders`
--
ALTER TABLE `preorders`
  ADD CONSTRAINT `fk_preorders_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_preorders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `voucher`
--
-- ALTER TABLE `voucher`
--   ADD CONSTRAINT `fk_voucher_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
