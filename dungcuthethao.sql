-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2025 at 03:08 PM
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
-- Database: `dungcuthethao`
--
CREATE DATABASE IF NOT EXISTS `dungcuthethao` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dungcuthethao`;

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
(6, 2, 'Nguyen Van A', '0123456789', '123 Đường ABC', 0, '2025-10-04 14:34:34'),
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `slug`) VALUES
(1, 'Yonex', 'vot-yonex'),
(2, 'Lining', 'vot-lining'),
(3, 'Victor', 'victor'),
(4, 'nike', 'giay-nike');

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
(2, 2, NULL, 6, 500000, 450000, 'pending', '2025-10-04 14:34:35'),
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` 
(`product_id`, `category_id`, `brand_id`, `name`, `slug`, `description`, `price`, `image`, `created_at`) VALUES
(1, 1, 1, 'Vợt Yonex Astrox 77 Pro Đỏ', 'axtrox-77', 'Vợt tấn công bùng nổ', 550000, 'astrox-77-pro.jpg', '2025-09-13 07:50:32'),
(2, 1, 1, 'Vợt Yonex Astrox 88d pro', 'axtrox-88', 'Giày thể thao nhẹ, êm ái, thích hợp cho việc chạy bộ hoặc tập gym.', 750000, 'astrox-88d-pro-ch.jpg', '2025-09-13 07:50:32'),
(3, 1, 2, 'Vợt Axforce 100 Vàng Golden', '100-golden', 'Điện thoại thông minh với camera sắc nét, pin dung lượng lớn và thiết kế sang trọng.', 1200000, 'axforce-100-vang-golden.jpg', '2025-09-13 07:50:32'),
(9, 1, 1, 'Vợt Yonex Nanoflare 800 Pro', 'nanaflare-800', 'Vợt rất nhẹ nhàng', 500000, 'nanoflare800.jpg', '2025-09-13 21:12:07'),
(11, 1, 2, 'Vợt Axforce 90 Xanh Dragon', '90-dragon', 'Vợt thiên hướng tấn công toàn diện', 500000, 'axforce-90-xanh-dragon-max.jpg', '2025-09-13 23:10:27'),
(12, 2, NULL, 'Vợt Pickle Ball Head Extreme Lite', 'Extreme-Lite', 'Vợt PickelBall Tốt', 400000, 'HeadExtremeElite.jpg', '2025-09-13 23:35:52'),
(14, 2, NULL, 'Vợt Pickle Ball Head Radical Lite', 'Radical-lite', 'Vợt Pickel Ball nhẹ nhàng', 600000, 'HeadRadicalElite.jpg', '2025-09-13 23:43:51'),
(15, 2, NULL, 'Vợt PickelBall HeadSparkElite', 'Spark-elite', 'Vợt phù hợp cho người mới chơi', 550000, 'HeadSparkElite.jpg', '2025-09-14 00:01:09'),
(25, 10, NULL, 'Giày Nữ Thời Trang', 'giay-nu', 'Giày nữ dịu êm', 750000, 'bongda.JPG', '2025-09-17 05:56:22'),
(33, 1, 2, 'Vợt Canno Pro', 'cannon-pro', 'rgrrrry', 850000, 'mubaohiem.JPG', '2025-09-18 07:20:13');
(37, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour VA', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100 Tour VA là một trong những siêu phẩm mới nhất mà Yonex vừa giới thiệu, kế thừa trọn vẹn tinh hoa công nghệ của dòng Astrox – biểu tượng của lối chơi tấn công mạnh mẽ với những cú đập cầu uy lực và góc đánh hiểm hóc. Đây là phiên bản giới hạn với bộ nhận diện riêng về màu sắc và thương hiệu, được áp dụng cho toàn bộ dòng Astrox 100 VA. So với bản gốc, Astrox 100 Tour VA vẫn giữ trọn tinh thần của nhà vô địch nhưng ở mức giá dễ tiếp cận hơn, phù hợp cho người chơi muốn trải nghiệm hiệu suất thi đấu ở đẳng cấp cao.', 4469000, 'vot-cau-long-yonex-astrox-100-tour-va.webp', '2025-10-04 08:02:10'),
(38, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Play 2025', 'vot cau long yonex', '- Vợt cầu lông Yonex Astrox 99 Play 2025 dù là phiên bản tầm thấp nhất trong dòng vợt 99 2025 này, nhưng vợt vẫn được trang bị công nghệ sở hữu Rotational Generator System cải tiến, phân bổ trọng lượng trên đầu cán vợt, đỉnh khung vợt và khớp nối, mang lại những pha chuyển tiếp liền mạch và những pha tấn công liên tục.', 1769000, 'vot-cau-long-yonex-astrox-99-play-2025.webp', '2025-10-04 09:35:34'),
(39, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour 2025', 'vot cau long yonex', '- Vợt cầu lông Yonex Astrox 99 Tour 2025 hay còn được gọi là 99 Tour Gen 3 với thiết kế lấy cảm hứng từ những thiên thạch va chạm với các hành tinh, tượng trưng cho sức mạnh áp đảo. Phần đế màu đen và xanh lá cây được điểm xuyết bằng họa tiết vân đá cẩm thạch gợi lên sức nặng và sức mạnh, trong khi những vệt màu cam kéo dài từ khung vợt đến tay cầm tượng trưng cho việc truyền tải thông tin cú đánh từ khung vợt đến tay cầm. ', 4359000, 'vot-cau-long-yonex-astrox-100-tour-va.webp', '2025-10-04 09:37:49'),
(40, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ VA', 'vot cau long yonex', '- Vợt cầu lông Yonex Astrox 100ZZ VA là phiên bản đặc biệt “VA Signature” của dòng Astrox 100ZZ từ Yonex - cây vợt chuyên nghiệp này được thiết kế riêng theo phong cách cá nhân của vận động viên Viktor Axelsen. Nó thể hiện rõ phương châm "Chúng ta cùng nhau phấn đấu" của nhà vô địch Olympic. Vợt với màu sắc trắng xanh này là phiên bản giới hạn của mẫu vợt chủ lực thuộc dòng Astrox, với độ cân bằng cao ở đầu vợt và cán vợt cực kỳ cứng cáp, lý tưởng cho những người chơi tìm kiếm sức mạnh và độ chính xác tối đa.', 5329000, 'vot-cau-long-yonex-astrox-100zz-va-grayish-beige-chinh-hang_1758152558.webp', '2025-10-04 09:39:21'),
(41, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Game 2025', 'vot cau long yonex', '- Vợt cầu lông Yonex Astrox 99 Game 2025 lấy cảm hứng từ những thiên thạch va chạm với các hành tinh, tượng trưng cho sức mạnh áp đảo. Phần đế màu đen và xanh lá cây được điểm xuyết bằng họa tiết vân đá cẩm thạch gợi lên sức nặng và sức mạnh, trong khi những vệt màu cam kéo dài từ khung vợt đến tay cầm tượng trưng cho việc truyền tải thông tin cú đánh từ khung vợt đến tay cầm.', 2689000, 'vot-cau-long-yonex-astrox-99-game-2025-black-green-chinh-hang_1756252214 (1).webp', '2025-10-04 09:40:19'),
(42, 1, 1, 'Vợt cầu lông Yonex Nanoflare Junior', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare Junior được thiết kế cho lối chơi tốc độ, linh hoạt giữa công và thủ với điểm cân bằng ở mức cân bằng. Đũa vợt siêu dẻo mang lại khả năng trợ lực một cách tối ưu, trọng lượng 4U không quá nặng, thích hợp cho những người mới bắt đầu tập làm quen với bộ môn này hoặc các lông thủ nhí.', 1639000, '1.webp', '2025-10-04 09:42:20'),
(43, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100ZZ Kurenai nổi trội không chỉ là cây vợt cầu lông cao cấp nhất của nhà Yonex mà em nó còn là một trong những siêu phẩm vợt được sử dụng thành công nhất trên thế giới. Đồng hành cùng Victor Axelsen đăng quang rất nhiều ngôi vô địch trong đó có cả chiếc Huy chương Vàng _Olympic Tokyo 2020. Bên cạnh đó, các tay vợt hàng đầu hiện nay như Akane Yamaguchi, Takuro Hoki, Lakshya Sen cũng đang sử dụng cây vợt này.', 5169000, '2.webp', '2025-10-07 08:01:28'),
(44, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Pro', 'vot cau long yonex', '- Sau khi nhà Yonex cho ra mắt 3 phiên bản gồm Astrox 77 Xanh Dương - Astrox 77 Xanh Chuối và Astrox 77 Đỏ được hầu hết cả vận động viên cùng người chơi phong trào rất ưa chuộng, sử dụng thi đấu siêu thành công thì thương hiệu cầu lông top đầu Nhật Bản đã cho trình làng trên toàn thế giới một siêu phẩm mới với tên gọi đầy đủ là vợt cầu lông Yonex Astrox 77 Pro - Tối ưu hơn trong những pha cầu tốc độ nhanh.', 4138998, '3.webp', '2025-10-07 08:02:40'),
(45, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Pro 2024', 'vot cau long yonex', '- Vợt cầu lông Yonex Nanoflare 700 Pro 2024 là phiên bản nâng cấp của dòng Nanoflare 700, thiên về lối chơi linh hoạt, thiên về phản tạt, điều cầu tốc độ nhanh với độ chính xác cao.  - Thiết kế khung được tích hợp công nghệ AERO FRAME được vát tròn để tạo ra cấu trúc khung hình oval để giảm lực cản của không khí để tăng khả năng cơ động để thực hiện những pha phản tạt nhanh. Đũa vợt được làm siêu mỏng nhưng vẫn đảm bảo độ bền cực tốt, là sự lựa chọn phù hợp cho những tay vợt ưa thích tốc độ phản tạt cao.', 1649000, '4.webp', '2025-10-07 08:03:21'),
(46, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Pro', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 99 Pro là cây vợt chuyên nghiệp, thuộc dòng Astrox 99 Series, dành cho những người chơi có lối đánh mạnh mẽ, tấn công uy lực. Công nghệ Rotational Generator System giúp phân bổ trọng lượng tối ưu cho từng cú đánh, tăng hiệu suất và chính xác.', 4359000, '5.webp', '2025-10-07 08:04:02'),
(47, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour Pro', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 99 Tour Pro với thiết kế mạnh mẽ, giúp phát huy tối đa lực đánh từ người chơi. Độ cứng khung vừa phải giúp các pha đập cầu uy lực nhưng vẫn đảm bảo độ linh hoạt trong những pha phản tạt.', 4359000, '6.webp', '2025-10-07 08:05:10'),
(48, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Pro', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100ZZ Pro – phiên bản đặc biệt với trọng lượng cân bằng, phù hợp cho lối đánh toàn diện. Đũa vợt cứng, kết hợp với Rotational Generator System giúp tăng tốc độ và sức mạnh khi đập cầu.', 5329000, '7.webp', '2025-10-07 08:06:20'),
(49, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Tour', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100 Tour – lý tưởng cho những tay vợt muốn tối ưu sức mạnh và tấn công liên tục. Khung vợt được thiết kế khí động học, đũa vợt cứng, mang lại cảm giác ổn định khi đập cầu.', 4469000, '8.webp', '2025-10-07 08:07:30'),
(50, 1, 1, 'Vợt cầu lông Yonex Astrox 88D Pro', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 88D Pro, lối chơi cân bằng giữa công và thủ, phù hợp với nhiều trình độ. Công nghệ Rotational Generator System giúp tối ưu các cú smash và phản tạt.', 750000, '9.webp', '2025-10-07 08:08:40'),
(51, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare 800 – nhẹ, linh hoạt, tốc độ phản tạt nhanh, thích hợp cho những người chơi thiên về tốc độ và kỹ thuật.', 500000, '10.webp', '2025-10-07 08:09:50'),
(52, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare 700 – tập trung vào tốc độ, phản tạt nhanh, linh hoạt trong từng cú đánh.', 1639000, '11.webp', '2025-10-07 08:10:50'),
(53, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Tour', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare 700 Tour – tăng tốc độ phản tạt, độ linh hoạt và cảm giác kiểm soát cầu tốt.', 1649000, '12.webp', '2025-10-07 08:11:50'),
(54, 1, 1, 'Vợt cầu lông Yonex Nanoflare 700 Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare 700 Lite – nhẹ nhàng, dễ điều khiển, phù hợp người mới chơi và trẻ em.', 1639000, '13.webp', '2025-10-07 08:12:50'),
(55, 1, 1, 'Vợt cầu lông Yonex Nanoflare 800 Pro Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare 800 Pro Lite – phiên bản nhẹ, tốc độ cao, phù hợp người chơi chuyên nghiệp.', 500000, '14.webp', '2025-10-07 08:13:50'),
(56, 1, 1, 'Vợt cầu lông Yonex Nanoflare Junior Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Nanoflare Junior Lite – nhẹ, dễ điều khiển, phù hợp trẻ em và người mới tập.', 1639000, '15.webp', '2025-10-07 08:14:50'),
(57, 1, 1, 'Vợt cầu lông Yonex Astrox 77 Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 77 Lite – nhẹ, cân bằng, giúp dễ thực hiện những cú smash uy lực nhưng vẫn linh hoạt trong từng pha đánh.', 550000, '16.webp', '2025-10-07 08:15:50'),
(58, 1, 1, 'Vợt cầu lông Yonex Astrox 88 Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 88 Lite – tối ưu cho phản tạt và tốc độ, trọng lượng nhẹ, phù hợp chơi lâu dài.', 750000, '17.webp', '2025-10-07 08:16:50'),
(59, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 99 Lite – nhẹ, linh hoạt, tốc độ phản tạt cao, dành cho lối chơi tấn công toàn diện.', 4359000, '18.webp', '2025-10-07 08:17:50'),
(60, 1, 1, 'Vợt cầu lông Yonex Astrox 100 Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100 Lite – tối ưu sức mạnh, tốc độ phản tạt cao, thiết kế khí động học.', 4469000, '19.webp', '2025-10-07 08:18:50'),
(61, 1, 1, 'Vợt cầu lông Yonex Astrox 100ZZ Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 100ZZ Lite – phiên bản nhẹ, cân bằng, thích hợp lối chơi tấn công mạnh mẽ và chính xác.', 5329000, '20.webp', '2025-10-07 08:19:50'),
(62, 1, 1, 'Vợt cầu lông Yonex Astrox 99 Tour Lite', 'vot cau long yonex', 'Vợt cầu lông Yonex Astrox 99 Tour Lite – nhẹ, tốc độ phản tạt cao, lối chơi tấn công tối ưu.', 4359000, '21.webp', '2025-10-07 08:20:50');

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone`, `address`, `role`, `status`, `created_at`) VALUES
(2, 'Tran Thi B', 'b@example.com', '$2b$10$Q9E3hX9M8kKPejNKvR.Yc.1SgDNYDkAZyTt3YUMc3xHcTej8rRj4G', '0987654321', '456 Hai Bà Trưng, Hà Nội', 'admin', 'active', '2025-09-13 07:50:31'),
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
(3, 'Flash-sale tháng 12', 'Đại Tiệc Bùng nổ', 'percent', 20, 700000, 4, 0, '2025-10-14', '2025-10-21', 'active', '2025-10-07 02:04:56');


DROP TABLE IF EXISTS `preorders`;
CREATE TABLE `preorders` (
  `preorder_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_amount` DECIMAL(12,2) GENERATED ALWAYS AS (`price` * `quantity`) STORED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`preorder_id`),
  KEY `idx_preorders_product` (`product_id`),
  KEY `idx_preorders_user` (`user_id`),
  CONSTRAINT `fk_preorders_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_preorders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



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
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `order_details_ibfk_3` FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE SET NULL,
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
