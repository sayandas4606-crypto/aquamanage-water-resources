-- ====================================================================
-- Database Schema for "Water Resources & Management" Educational Portal
-- Project: B.Tech CSE College Final / Semester Presentation
-- Topic: Water Resources and Sustainable Management
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ====================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `water_management_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `water_management_db`;

-- --------------------------------------------------------
-- Table structure for `contact_messages`
-- Stores inquiries, feedback, and student/faculty messages
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `subject` VARCHAR(200) NOT NULL,
    `category` ENUM('General Inquiry', 'Academic Research', 'Conservation Initiative', 'Technical Issue', 'Collaboration') DEFAULT 'General Inquiry',
    `message` TEXT NOT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `feedback_reviews`
-- Stores user ratings and feedback on the educational content
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feedback_reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(100) NOT NULL,
    `user_email` VARCHAR(150) NOT NULL,
    `user_role` ENUM('Student', 'Faculty/Professor', 'Researcher', 'Environmentalist', 'General Public') DEFAULT 'Student',
    `rating` TINYINT(1) NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `feedback_category` VARCHAR(100) DEFAULT 'Overall Quality',
    `comments` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_approved` TINYINT(1) DEFAULT 1,
    INDEX `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `water_usage_records`
-- Logs user submissions from the Interactive Water Calculator
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `water_usage_records` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(100) DEFAULT 'Anonymous User',
    `family_members` INT DEFAULT 1,
    `daily_liters` DECIMAL(10, 2) NOT NULL,
    `monthly_liters` DECIMAL(12, 2) NOT NULL,
    `annual_liters` DECIMAL(14, 2) NOT NULL,
    `per_capita_daily` DECIMAL(10, 2) NOT NULL,
    `efficiency_grade` VARCHAR(100) NOT NULL,
    `breakdown_json` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_efficiency` (`efficiency_grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `water_pledges`
-- Community pledges committed by students and visitors
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `water_pledges` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(120) NOT NULL,
    `institution` VARCHAR(150) DEFAULT 'College / University',
    `target_liters_to_save` INT NOT NULL DEFAULT 50,
    `pledge_action` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Sample Seed Data (for initial presentation and testing)
-- ====================================================================

INSERT INTO `contact_messages` (`full_name`, `email`, `phone`, `subject`, `category`, `message`, `status`) VALUES
('Dr. Ramesh Sharma', 'dr.ramesh.cse@college.edu', '+91 9876543210', 'Excellent Presentation Topic & Technical Scope', 'Academic Research', 'Impressive integration of computer science analytics with hydrological resource management. The IoT monitoring section is particularly noteworthy.', 'Read'),
('Ananya Deshmukh', 'ananya.d@student.ac.in', '+91 9823456781', 'Collaboration for Campus Rainwater Audit', 'Conservation Initiative', 'We would like to utilize your water footprint calculator for the annual campus green audit. Keep up the brilliant work!', 'Unread');

INSERT INTO `feedback_reviews` (`user_name`, `user_email`, `user_role`, `rating`, `feedback_category`, `comments`, `is_approved`) VALUES
('Prof. K. V. Narayana', 'narayana.faculty@university.edu', 'Faculty/Professor', 5, 'Website UI & Architecture', 'Brilliant execution! The data visualization, responsive glassmorphism aesthetic, and backend database schema represent true engineering excellence.', 1),
('Siddharth Verma', 'siddharth.v@greenearth.org', 'Environmentalist', 5, 'Educational Content', 'The clarity on Managed Aquifer Recharge (MAR) and SCADA water distribution makes this educational portal far superior to conventional textbooks.', 1),
('Pooja Nair', 'pooja.nair@engg.edu', 'Student', 5, 'Interactive Calculator', 'Calculated my household consumption and discovered our leaky faucet was wasting 24 liters daily. Highly engaging and informative!', 1);

INSERT INTO `water_pledges` (`full_name`, `institution`, `target_liters_to_save`, `pledge_action`) VALUES
('Aarav Mehta', 'B.Tech CSE - Final Year', 120, 'Turn off tap while brushing & 5-minute showers'),
('Sneha Patel', 'Dept. of Environmental Engg', 85, 'Installed low-flow aerators on all home faucets'),
('Vikramaditya Roy', 'IIT Roorkee Scholar', 200, 'Reusing kitchen RO reject water for gardening and floor washing');
