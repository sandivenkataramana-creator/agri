-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2026 at 07:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hod_management2`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','half_day','leave') DEFAULT 'present',
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `staff_id`, `hod_id`, `date`, `status`, `check_in`, `check_out`, `remarks`, `created_at`) VALUES
(54, 1, 11, '2026-01-02', 'present', '09:00:00', '18:00:00', 'On time', '2026-01-02 06:12:58'),
(55, 2, 12, '2026-01-02', 'present', '09:15:00', '18:30:00', 'On time', '2026-01-02 06:12:58'),
(56, 3, 13, '2026-01-02', 'present', '09:00:00', '17:45:00', 'Left early', '2026-01-02 06:12:58'),
(57, 4, 14, '2026-01-02', 'absent', NULL, NULL, 'Sick leave', '2026-01-02 06:12:58'),
(58, 5, 15, '2026-01-02', 'half_day', '09:00:00', '13:00:00', 'Personal work', '2026-01-02 06:12:58'),
(59, 1, 11, '2026-01-01', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(60, 2, 12, '2026-01-01', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(61, 3, 13, '2026-01-01', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(62, 4, 14, '2026-01-01', 'present', '09:30:00', '18:00:00', 'Late', '2026-01-02 06:12:58'),
(63, 5, 15, '2026-01-01', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(64, 1, 11, '2025-12-31', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(65, 2, 12, '2025-12-31', 'absent', NULL, NULL, 'Medical leave', '2026-01-02 06:12:58'),
(66, 3, 13, '2025-12-31', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(67, 4, 14, '2025-12-31', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:58'),
(68, 5, 15, '2025-12-31', 'half_day', '09:00:00', '13:30:00', NULL, '2026-01-02 06:12:58'),
(69, 1, 11, '2025-12-30', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(70, 2, 12, '2025-12-30', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(71, 3, 13, '2025-12-30', 'leave', NULL, NULL, 'Annual leave', '2026-01-02 06:12:59'),
(72, 4, 14, '2025-12-30', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(73, 5, 15, '2025-12-30', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(74, 1, 11, '2025-12-29', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(75, 2, 12, '2025-12-29', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(76, 3, 13, '2025-12-29', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(77, 4, 14, '2025-12-29', 'absent', NULL, NULL, 'Emergency', '2026-01-02 06:12:59'),
(78, 5, 15, '2025-12-29', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(79, 1, 11, '2025-12-28', 'half_day', '09:00:00', '13:00:00', 'Doctor appointment', '2026-01-02 06:12:59'),
(80, 2, 12, '2025-12-28', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(81, 3, 13, '2025-12-28', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(82, 4, 14, '2025-12-28', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(83, 5, 15, '2025-12-28', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(84, 1, 11, '2025-12-27', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(85, 2, 12, '2025-12-27', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(86, 3, 13, '2025-12-27', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(87, 4, 14, '2025-12-27', 'present', '09:00:00', '18:00:00', NULL, '2026-01-02 06:12:59'),
(88, 5, 15, '2025-12-27', 'leave', NULL, NULL, 'Festival leave', '2026-01-02 06:12:59');

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

CREATE TABLE `budget` (
  `id` int(11) NOT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `scheme_id` int(11) DEFAULT NULL,
  `financial_year` varchar(20) DEFAULT NULL,
  `allocated_amount` decimal(15,2) DEFAULT 0.00,
  `utilized_amount` decimal(15,2) DEFAULT 0.00,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `district_id` int(11) DEFAULT NULL,
  `mandal_id` int(11) DEFAULT NULL,
  `village` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`id`, `hod_id`, `scheme_id`, `financial_year`, `allocated_amount`, `utilized_amount`, `category`, `description`, `state_id`, `district_id`, `mandal_id`, `village`, `created_at`, `updated_at`) VALUES
(27, 14, 20, '2024-25', 75000000.00, 52000000.00, 'Employment', 'Rythu Bandhu scheme budget for Horticulture', 1, 5, 1, 'Forest area', '2026-01-02 05:48:38', '2026-01-02 05:52:11'),
(28, 11, 16, '2024-25', 60000000.00, 45000000.00, 'Agriculture', 'PM-KISAN budget allocation', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:51:42'),
(29, 16, 13, '2024-25', 15000000.00, 1100000.00, 'Health & Welfare', 'Silk Samagra scheme budget', 1, 5, 2, NULL, '2026-01-02 05:48:38', '2026-01-02 05:52:48'),
(30, 3, 4, '2024-25', 20000000.00, 14000000.00, 'Fisheries', 'Blue Revolution budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(31, 4, 5, '2024-25', 45000000.00, 32000000.00, 'Dairy', 'Rashtriya Gokul Mission budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(32, 5, 6, '2024-25', 55000000.00, 38000000.00, 'Insurance', 'PMFBY budget allocation', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(33, 5, 7, '2024-25', 12000000.00, 9500000.00, 'Soil Health', 'Soil Health Card budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(34, 6, 8, '2024-25', 25000000.00, 18000000.00, 'Oilseeds', 'National Mission on Oilseeds budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(35, 7, 9, '2024-25', 18000000.00, 12000000.00, 'Marketing', 'e-NAM platform budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(36, 8, 10, '2024-25', 35000000.00, 28000000.00, 'Irrigation', 'Micro Irrigation scheme budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(37, 1, 11, '2024-25', 22000000.00, 15000000.00, 'Organic Farming', 'PKVY scheme budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38'),
(38, 7, 12, '2024-25', 40000000.00, 30000000.00, 'Credit', 'Kisan Credit Card budget', NULL, NULL, NULL, NULL, '2026-01-02 05:48:38', '2026-01-02 05:48:38');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Agriculture', 'Agriculture and related departments', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(2, 'Rural Development', 'Rural development and welfare', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(3, 'Urban Planning', 'Urban planning and infrastructure', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(4, 'Health & Welfare', 'Health and welfare departments', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(5, 'Education', 'Education and training departments', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(6, 'Employment', 'Employment and skill development', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(7, 'Infrastructure', 'Infrastructure development', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32'),
(8, 'Sanitation', 'Sanitation and cleanliness', 'active', '2025-12-30 12:26:32', '2025-12-30 12:26:32');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state_id` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `state_id`, `created_date`, `updated_date`, `status`) VALUES
(2, 'Jagtial', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(3, 'Kumaram Bheem Asifabad', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(4, 'Mancherial', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(5, 'Adilabad', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(6, 'Nirmal', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(7, 'Nizamabad', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(8, 'Kamareddy', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(9, 'Peddapalli', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(10, 'Karimnagar', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1),
(11, 'Rajanna Sircilla', 1, '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `hods`
--

CREATE TABLE `hods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hods`
--

INSERT INTO `hods` (`id`, `name`, `department`, `category_id`, `email`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(11, 'Dr. Rajesh Kumar', 'Horticulture', 1, 'rajesh.kumar@agri.gov.in', '9876543210', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(12, 'Smt. Priya Sharma', 'Sericulture', 2, 'priya.sharma@agri.gov.in', '9876543211', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(13, 'Shri. Venkat Rao', 'Fisheries', 3, 'venkat.rao@agri.gov.in', '9876543212', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(14, 'Dr. Lakshmi Devi', 'Animal Husbandry', 4, 'lakshmi.devi@agri.gov.in', '9876543213', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(15, 'Shri. Mohd. Imran', 'Soil Conservation', 5, 'mohd.imran@agri.gov.in', '9876543214', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(16, 'Dr. Suresh Reddy', 'Seed Certification', 6, 'suresh.reddy@agri.gov.in', '9876543215', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(17, 'Smt. Kavitha Rani', 'Agricultural Marketing', 7, 'kavitha.rani@agri.gov.in', '9876543216', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09'),
(18, 'Shri. Ramesh Babu', 'Irrigation', 9, 'ramesh.babu@agri.gov.in', '9876543217', 'active', '2026-01-02 05:44:09', '2026-01-02 05:44:09');

-- --------------------------------------------------------

--
-- Table structure for table `kpis`
--

CREATE TABLE `kpis` (
  `id` int(11) NOT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `kpi_name` varchar(255) NOT NULL,
  `target_value` decimal(15,2) DEFAULT NULL,
  `achieved_value` decimal(15,2) DEFAULT 0.00,
  `unit` varchar(50) DEFAULT NULL,
  `period` varchar(50) DEFAULT NULL,
  `status` enum('on_track','at_risk','behind','completed') DEFAULT 'on_track',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kpis`
--

INSERT INTO `kpis` (`id`, `hod_id`, `kpi_name`, `target_value`, `achieved_value`, `unit`, `period`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Farmers Benefited', 100000.00, 75000.00, 'Count', 'Quarterly', 'on_track', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(2, 2, 'Man-days Generated', 500000.00, 380000.00, 'Days', 'Quarterly', 'on_track', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(3, 3, 'Projects Completed', 50.00, 32.00, 'Count', 'Yearly', 'at_risk', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(4, 4, 'Patients Treated', 200000.00, 180000.00, 'Count', 'Quarterly', 'on_track', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(5, 5, 'Schools Covered', 5000.00, 4500.00, 'Count', 'Yearly', 'on_track', '2025-12-29 11:48:54', '2025-12-29 11:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `mandals`
--

CREATE TABLE `mandals` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `district_id` int(11) NOT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  `updated_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mandals`
--

INSERT INTO `mandals` (`id`, `name`, `district_id`, `created_date`, `updated_date`, `status`) VALUES
(1, 'Adilabad', 5, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(2, 'Adilabad (rural)', 5, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(3, 'Adilabad (urban)', 5, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(58, 'Beerpur', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(59, 'Bheemaram', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(60, 'Buggaram', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(61, 'Dharmapuri', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(62, 'Gollapalle', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(63, 'Ibrahimpatnam', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(64, 'Jagtial', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(65, 'Jagtial rural', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(66, 'Kodimial', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(67, 'Koratla', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(68, 'Kothlapur', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(69, 'Mallapur', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(70, 'Mallial', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(71, 'Medipalle', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(72, 'Metpalle', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(73, 'Pegadapalle', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1),
(74, 'Raikal', 2, '2025-12-30 17:56:32', '2025-12-30 17:56:32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `nodal_officers`
--

CREATE TABLE `nodal_officers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `scheme_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nodal_officers`
--

INSERT INTO `nodal_officers` (`id`, `name`, `designation`, `department`, `scheme_id`, `email`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ramesh Babu', 'Nodal Officer', 'Agriculture', 1, 'ramesh.babu@gov.in', '9876543230', 'active', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(2, 'Sita Devi', 'Nodal Officer', 'Rural Development', 2, 'sita.devi@gov.in', '9876543231', 'active', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(3, 'Ganesh Kumar', 'Nodal Officer', 'Urban Planning', 3, 'ganesh.kumar@gov.in', '9876543232', 'active', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(4, 'Anitha Rao', 'Nodal Officer', 'Health & Welfare', 4, 'anitha.rao@gov.in', '9876543233', 'active', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(5, 'Bharat Singh', 'Nodal Officer', 'Education', 5, 'bharat.singh@gov.in', '9876543234', 'active', '2025-12-29 11:48:54', '2025-12-29 11:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_otps`
--

CREATE TABLE `password_reset_otps` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `revenue`
--

CREATE TABLE `revenue` (
  `id` int(11) NOT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `scheme_id` int(11) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revenue`
--

INSERT INTO `revenue` (`id`, `hod_id`, `scheme_id`, `amount`, `source`, `category`, `date`, `description`, `created_at`, `updated_at`) VALUES
(8, 11, 1, 25000000.00, 'State Government Grant', 'Farmer Support', '2024-12-01', 'Rythu Bandhu Q4 allocation', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(9, 11, 2, 20000000.00, 'Central Government Fund', 'Farmer Support', '2024-12-01', 'PM-KISAN funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(10, 12, 3, 8000000.00, 'Central Silk Board', 'Sericulture', '2024-12-01', 'Silk Samagra funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(11, 13, 4, 12000000.00, 'Blue Revolution Fund', 'Fisheries', '2024-12-01', 'Fisheries development funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(12, 14, 5, 18000000.00, 'Central Government', 'Dairy', '2024-12-01', 'Gokul Mission allocation', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(13, 15, 6, 22000000.00, 'Central Pool', 'Insurance', '2024-12-01', 'PMFBY premium subsidy', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(14, 15, 7, 6000000.00, 'State Budget', 'Soil Health', '2024-12-01', 'Soil testing funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(15, 16, 8, 10000000.00, 'NMOOP Fund', 'Oilseeds', '2024-11-15', 'Oilseeds mission allocation', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(16, 17, 9, 8000000.00, 'e-NAM Fund', 'Marketing', '2024-11-20', 'Digital marketing platform funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(17, 18, 10, 15000000.00, 'PMKSY Fund', 'Irrigation', '2024-12-01', 'Micro irrigation subsidy', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(18, 11, 11, 9000000.00, 'Organic Farming Fund', 'Organic Farming', '2024-11-25', 'PKVY scheme funds', '2026-01-02 05:58:21', '2026-01-02 06:12:58'),
(19, 17, 12, 18000000.00, 'NABARD', 'Credit', '2024-12-05', 'KCC interest subvention', '2026-01-02 05:58:21', '2026-01-02 06:12:58');

-- --------------------------------------------------------

--
-- Table structure for table `schemes`
--

CREATE TABLE `schemes` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `hod_id` int(11) NOT NULL,
  `scheme_description` text DEFAULT NULL,
  `scheme_objective` text DEFAULT NULL,
  `scheme_benefits_desc` text DEFAULT NULL,
  `scheme_benefits_person` int(11) DEFAULT 0,
  `total_budget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('PLANNED','ACTIVE','COMPLETED') DEFAULT 'PLANNED',
  `scheme_category` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schemes`
--

INSERT INTO `schemes` (`id`, `name`, `hod_id`, `scheme_description`, `scheme_objective`, `scheme_benefits_desc`, `scheme_benefits_person`, `total_budget`, `start_date`, `end_date`, `status`, `scheme_category`, `created_at`, `updated_at`, `category_id`) VALUES
(9, 'Rythu Bandhu', 1, 'Investment support scheme for farmers providing Rs.10,000 per acre per season', 'To provide investment support for agriculture and horticulture crops', 'Direct benefit transfer to farmer bank accounts twice a year', 580000, 75000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Farmer Support', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 1),
(10, 'PM-KISAN', 1, 'Direct income support of Rs.6000 per year to land-holding farmers', 'To supplement financial needs of small and marginal farmers', 'Three equal installments of Rs.2000 directly to bank accounts', 450000, 60000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Farmer Support', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 1),
(11, 'Silk Samagra', 2, 'Integrated scheme for development of silk industry', 'To boost silk production and support sericulture farmers', 'Subsidy on mulberry cultivation, silkworm rearing equipment', 25000, 15000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Sericulture', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 2),
(12, 'Blue Revolution', 14, 'Integrated development of inland fisheries', 'To increase fish production and provide livelihood to fishermen', 'Financial assistance for pond construction, fish seed, feed', 35000, 20000000.00, '2023-12-30', '2025-12-29', 'ACTIVE', 'Fisheries', '2026-01-02 05:46:36', '2026-01-02 05:54:24', 3),
(13, 'Rashtriya Gokul Mission', 4, 'Development and conservation of indigenous cattle breeds', 'To enhance productivity of bovines and increase milk production', 'Support for breeding, fodder development, healthcare', 120000, 45000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Dairy', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 4),
(14, 'Pradhan Mantri Fasal Bima Yojana', 5, 'Crop insurance scheme for farmers', 'To provide insurance coverage and financial support in case of crop failure', 'Low premium rates and quick claim settlement', 380000, 55000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Insurance', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 8),
(15, 'Soil Health Card', 5, 'Soil testing and nutrient management program', 'To promote balanced use of fertilizers and improve soil health', 'Free soil testing and crop-wise fertilizer recommendations', 200000, 12000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Soil Health', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 5),
(16, 'National Mission on Oilseeds', 6, 'Promotion of oilseed crops production', 'To increase production and productivity of oilseeds', 'Certified seeds, demonstrations, farm mechanization support', 95000, 25000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Oilseeds', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 6),
(17, 'e-NAM', 11, 'Electronic National Agriculture Market platform', 'To create unified national market for agricultural commodities', 'Better price discovery, transparent trading, online payments', 150000, 18000000.00, '2023-12-31', '2025-12-30', 'ACTIVE', 'Marketing', '2026-01-02 05:46:36', '2026-01-02 05:54:05', 7),
(18, 'Micro Irrigation', 8, 'Drip and sprinkler irrigation systems promotion', 'To improve water use efficiency in agriculture', 'Subsidy up to 90% on drip and sprinkler systems', 85000, 35000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Irrigation', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 9),
(19, 'Paramparagat Krishi Vikas Yojana', 1, 'Promotion of organic farming', 'To develop organic farming through cluster approach', 'Support for organic inputs, certification, marketing', 45000, 22000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Organic Farming', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 10),
(20, 'Kisan Credit Card', 7, 'Credit support for farmers', 'To provide adequate and timely credit to farmers', 'Low interest loans up to Rs.3 lakhs for crop production', 320000, 40000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Credit', '2026-01-02 05:46:36', '2026-01-02 05:46:36', 7);

-- --------------------------------------------------------

--
-- Table structure for table `scheme_budget_allocation`
--

CREATE TABLE `scheme_budget_allocation` (
  `id` int(11) NOT NULL,
  `scheme_id` int(11) NOT NULL,
  `hod_id` int(11) NOT NULL,
  `hod_name` varchar(255) NOT NULL,
  `allocated_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `spent_amount` decimal(15,2) DEFAULT 0.00,
  `financial_year` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scheme_budget_allocation`
--

INSERT INTO `scheme_budget_allocation` (`id`, `scheme_id`, `hod_id`, `hod_name`, `allocated_amount`, `spent_amount`, `financial_year`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Dr. Rajesh Kumar', 50000000.00, 35000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(2, 2, 2, 'Smt. Priya Sharma', 80000000.00, 60000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(3, 3, 3, 'Shri. Venkat Rao', 100000000.00, 45000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(4, 4, 4, 'Dr. Lakshmi Devi', 75000000.00, 55000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(5, 5, 5, 'Shri. Mohd. Imran', 30000000.00, 25000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(6, 6, 1, 'Dr. Rajesh Kumar', 40000000.00, 30000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54'),
(7, 7, 3, 'Shri. Venkat Rao', 25000000.00, 18000000.00, '2024-25', '2025-12-29 11:48:54', '2025-12-29 11:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `hod_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `employee_id`, `designation`, `department`, `category_id`, `hod_id`, `email`, `phone`, `joining_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Venkat', NULL, NULL, 'IT', 5, 11, 'venkat@gmail.com', '900000001', NULL, 'active', '2026-01-02 05:29:18', '2026-01-02 06:12:58'),
(2, 'Ajay', NULL, NULL, 'Education', 5, 12, 'ajay@gmail.com', '900000002', NULL, 'active', '2026-01-02 05:29:18', '2026-01-02 06:12:58'),
(3, 'Ramesh', NULL, NULL, 'Finance', 5, 13, 'ramesh@gmail.com', '900000003', NULL, 'active', '2026-01-02 05:29:18', '2026-01-02 06:12:58'),
(4, 'Suresh', NULL, NULL, 'HR', 5, 14, 'suresh@gmail.com', '900000004', NULL, 'active', '2026-01-02 05:29:18', '2026-01-02 06:12:58'),
(5, 'Kiran', NULL, NULL, 'Admin', 5, 15, 'kiran@gmail.com', '900000005', NULL, 'active', '2026-01-02 05:29:18', '2026-01-02 06:12:58');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `created_date`, `updated_date`, `status`) VALUES
(1, 'Telangana', '2025-12-30 12:26:32', '2025-12-30 12:26:32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','hod','staff') NOT NULL DEFAULT 'staff',
  `hod_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `password_changed` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `hod_id`, `staff_id`, `name`, `status`, `password_changed`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'password123', 'admin@gov.in', 'admin', NULL, NULL, 'Admin User', 'active', 0, '2025-12-31 04:47:46', '2025-12-30 11:34:20', '2025-12-31 04:47:46'),
(2, 'hod1', 'password123', 'rajesh.kumar@gov.in', 'hod', 1, NULL, 'Dr. Rajesh Kumar', 'active', 0, '2025-12-31 04:41:13', '2025-12-30 11:34:20', '2025-12-31 04:41:13'),
(3, 'hod2', 'password123', 'priya.sharma@gov.in', 'hod', 2, NULL, 'Smt. Priya Sharma', 'active', 0, NULL, '2025-12-30 11:34:20', '2025-12-30 11:34:20'),
(4, 'staff1', 'password123', 'amit.patel@gov.in', 'staff', 1, 1, 'Amit Patel', 'active', 0, '2025-12-31 04:46:39', '2025-12-30 11:34:20', '2025-12-31 04:46:39'),
(5, 'staff2', 'password123', 'sneha.reddy@gov.in', 'staff', 2, 2, 'Sneha Reddy', 'active', 0, NULL, '2025-12-30 11:34:20', '2025-12-30 11:34:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `hod_id` (`hod_id`);

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hod_id` (`hod_id`),
  ADD KEY `scheme_id` (`scheme_id`),
  ADD KEY `state_id` (`state_id`),
  ADD KEY `district_id` (`district_id`),
  ADD KEY `mandal_id` (`mandal_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `state_id` (`state_id`);

--
-- Indexes for table `hods`
--
ALTER TABLE `hods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `kpis`
--
ALTER TABLE `kpis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hod_id` (`hod_id`);

--
-- Indexes for table `mandals`
--
ALTER TABLE `mandals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `district_id` (`district_id`);

--
-- Indexes for table `nodal_officers`
--
ALTER TABLE `nodal_officers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scheme_id` (`scheme_id`);

--
-- Indexes for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_otp` (`otp`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `revenue`
--
ALTER TABLE `revenue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hod_id` (`hod_id`),
  ADD KEY `scheme_id` (`scheme_id`);

--
-- Indexes for table `schemes`
--
ALTER TABLE `schemes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hod_id` (`hod_id`);

--
-- Indexes for table `scheme_budget_allocation`
--
ALTER TABLE `scheme_budget_allocation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scheme_id` (`scheme_id`),
  ADD KEY `hod_id` (`hod_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD KEY `hod_id` (`hod_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `fk_users_hod` (`hod_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `hods`
--
ALTER TABLE `hods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `kpis`
--
ALTER TABLE `kpis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mandals`
--
ALTER TABLE `mandals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `nodal_officers`
--
ALTER TABLE `nodal_officers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `revenue`
--
ALTER TABLE `revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `schemes`
--
ALTER TABLE `schemes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `scheme_budget_allocation`
--
ALTER TABLE `scheme_budget_allocation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`hod_id`) REFERENCES `hods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`hod_id`) REFERENCES `hods` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `budget_ibfk_2` FOREIGN KEY (`scheme_id`) REFERENCES `schemes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `budget_ibfk_3` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `budget_ibfk_4` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `budget_ibfk_5` FOREIGN KEY (`mandal_id`) REFERENCES `mandals` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
