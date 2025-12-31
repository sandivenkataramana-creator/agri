-- Create Database
CREATE DATABASE IF NOT EXISTS hod_management;
USE hod_management;

-- HODs Table
CREATE TABLE IF NOT EXISTS hods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    category_id INT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Schemes Table
CREATE TABLE IF NOT EXISTS schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    hod_id INT NOT NULL,
    category_id INT,
    scheme_description TEXT,
    scheme_objective TEXT,
    scheme_benefits_desc TEXT,
    scheme_benefits_person INT DEFAULT 0,
    total_budget DECIMAL(15, 2) NOT NULL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status ENUM('PLANNED', 'ACTIVE', 'COMPLETED') DEFAULT 'PLANNED',
    scheme_category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Scheme Budget Allocation Table
CREATE TABLE IF NOT EXISTS scheme_budget_allocation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT NOT NULL,
    hod_id INT NOT NULL,
    hod_name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    financial_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE CASCADE
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    designation VARCHAR(100),
    department VARCHAR(255),
    category_id INT,
    hod_id INT,
    email VARCHAR(255),
    phone VARCHAR(20),
    joining_date DATE,
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Budget Table
CREATE TABLE IF NOT EXISTS budget (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hod_id INT,
    scheme_id INT,
    financial_year VARCHAR(20),
    allocated_amount DECIMAL(15, 2) DEFAULT 0,
    utilized_amount DECIMAL(15, 2) DEFAULT 0,
    category VARCHAR(100),
    description TEXT,
    state_id INT,
    district_id INT,
    mandal_id INT,
    village VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE SET NULL,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
    FOREIGN KEY (mandal_id) REFERENCES mandals(id) ON DELETE SET NULL
);

-- KPIs Table
CREATE TABLE IF NOT EXISTS kpis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hod_id INT,
    kpi_name VARCHAR(255) NOT NULL,
    target_value DECIMAL(15, 2),
    achieved_value DECIMAL(15, 2) DEFAULT 0,
    unit VARCHAR(50),
    period VARCHAR(50),
    status ENUM('on_track', 'at_risk', 'behind', 'completed') DEFAULT 'on_track',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL
);

-- Nodal Officers Table
CREATE TABLE IF NOT EXISTS nodal_officers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(255),
    scheme_id INT,
    email VARCHAR(255),
    phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE SET NULL
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT,
    hod_id INT,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'half_day', 'leave') DEFAULT 'present',
    check_in TIME,
    check_out TIME,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL
);

-- Revenue Table
CREATE TABLE IF NOT EXISTS revenue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hod_id INT,
    scheme_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    source VARCHAR(255),
    category VARCHAR(100),
    date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE SET NULL
);

-- Users Table for Authentication
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'hod', 'staff') NOT NULL DEFAULT 'staff',
    hod_id INT NULL,
    staff_id INT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    password_changed BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- OTP Table for Password Reset
CREATE TABLE IF NOT EXISTS password_reset_otps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_otp (otp),
    INDEX idx_expires (expires_at)
);

-- Categories/Departments Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- States Table (from telangana_db)
CREATE TABLE IF NOT EXISTS states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1
);

-- Districts Table (from telangana_db)
CREATE TABLE IF NOT EXISTS districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- Mandals Table (from telangana_db)
CREATE TABLE IF NOT EXISTS mandals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    district_id INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- Insert Sample Data

-- Sample HODs
INSERT INTO hods (name, department, email, phone, status) VALUES
('Dr. Rajesh Kumar', 'Agriculture', 'rajesh.kumar@gov.in', '9876543210', 'active'),
('Smt. Priya Sharma', 'Rural Development', 'priya.sharma@gov.in', '9876543211', 'active'),
('Shri. Venkat Rao', 'Urban Planning', 'venkat.rao@gov.in', '9876543212', 'active'),
('Dr. Lakshmi Devi', 'Health & Welfare', 'lakshmi.devi@gov.in', '9876543213', 'active'),
('Shri. Mohd. Imran', 'Education', 'mohd.imran@gov.in', '9876543214', 'active');

-- Sample Schemes
INSERT INTO schemes (name, hod_id, scheme_description, scheme_objective, scheme_benefits_desc, scheme_benefits_person, total_budget, start_date, end_date, status, scheme_category) VALUES
('Rythu Bandhu', 1, 'Investment support scheme for farmers providing financial assistance per acre', 'To provide investment support to agriculture and horticulture crops', 'Direct benefit transfer to farmer bank accounts', 500000, 50000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Agriculture'),
('MGNREGA', 2, 'Rural employment guarantee scheme providing 100 days of wage employment', 'To enhance livelihood security of rural households', 'Guaranteed wage employment and skill development', 800000, 80000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Employment'),
('Smart Cities Mission', 3, 'Urban infrastructure development for sustainable and citizen friendly cities', 'To promote sustainable and inclusive cities with core infrastructure', 'Improved urban infrastructure and quality of life', 200000, 100000000.00, '2024-01-01', '2025-12-31', 'ACTIVE', 'Infrastructure'),
('Ayushman Bharat', 4, 'Health insurance scheme providing coverage up to 5 lakhs per family', 'To provide health coverage to economically vulnerable families', 'Free health insurance and cashless treatment', 1000000, 75000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Healthcare'),
('Mid-Day Meal', 5, 'School meal program to improve nutritional status of children', 'To enhance enrollment, retention and attendance in schools', 'Nutritious meals and improved learning outcomes', 300000, 30000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Education'),
('PM-KISAN', 1, 'Direct income support to farmers with Rs.6000 per year', 'To supplement financial needs of land holding farmers', 'Direct cash transfer in three installments', 400000, 40000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Agriculture'),
('Swachh Bharat', 3, 'Cleanliness and sanitation mission for clean India', 'To achieve universal sanitation coverage', 'Construction of toilets and behavioral change', 150000, 25000000.00, '2024-01-01', '2024-12-31', 'ACTIVE', 'Sanitation');

-- Sample Scheme Budget Allocations
INSERT INTO scheme_budget_allocation (scheme_id, hod_id, hod_name, allocated_amount, spent_amount, financial_year) VALUES
(1, 1, 'Dr. Rajesh Kumar', 50000000.00, 35000000.00, '2024-25'),
(2, 2, 'Smt. Priya Sharma', 80000000.00, 60000000.00, '2024-25'),
(3, 3, 'Shri. Venkat Rao', 100000000.00, 45000000.00, '2024-25'),
(4, 4, 'Dr. Lakshmi Devi', 75000000.00, 55000000.00, '2024-25'),
(5, 5, 'Shri. Mohd. Imran', 30000000.00, 25000000.00, '2024-25'),
(6, 1, 'Dr. Rajesh Kumar', 40000000.00, 30000000.00, '2024-25'),
(7, 3, 'Shri. Venkat Rao', 25000000.00, 18000000.00, '2024-25');

-- Sample Staff
INSERT INTO staff (name, employee_id, designation, department, hod_id, email, phone, joining_date, status) VALUES
('Amit Patel', 'EMP001', 'Senior Officer', 'Agriculture', 1, 'amit.patel@gov.in', '9876543220', '2020-01-15', 'active'),
('Sneha Reddy', 'EMP002', 'Deputy Director', 'Rural Development', 2, 'sneha.reddy@gov.in', '9876543221', '2019-06-01', 'active'),
('Ravi Teja', 'EMP003', 'Assistant Director', 'Urban Planning', 3, 'ravi.teja@gov.in', '9876543222', '2021-03-10', 'active'),
('Kavitha Rani', 'EMP004', 'Program Manager', 'Health & Welfare', 4, 'kavitha.rani@gov.in', '9876543223', '2018-08-20', 'active'),
('Suresh Kumar', 'EMP005', 'Education Officer', 'Education', 5, 'suresh.kumar@gov.in', '9876543224', '2022-01-05', 'active'),
('Meena Kumari', 'EMP006', 'Field Officer', 'Agriculture', 1, 'meena.kumari@gov.in', '9876543225', '2021-07-15', 'active'),
('Prasad Rao', 'EMP007', 'Technical Officer', 'Urban Planning', 3, 'prasad.rao@gov.in', '9876543226', '2020-11-01', 'active');

-- Sample Budget entries
INSERT INTO budget (hod_id, scheme_id, financial_year, allocated_amount, utilized_amount, category, description) VALUES
(1, 1, '2024-25', 50000000.00, 35000000.00, 'Agriculture', 'Rythu Bandhu scheme budget'),
(2, 2, '2024-25', 80000000.00, 60000000.00, 'Employment', 'MGNREGA budget allocation'),
(3, 3, '2024-25', 100000000.00, 45000000.00, 'Infrastructure', 'Smart Cities budget'),
(4, 4, '2024-25', 75000000.00, 55000000.00, 'Healthcare', 'Ayushman Bharat budget'),
(5, 5, '2024-25', 30000000.00, 25000000.00, 'Education', 'Mid-Day Meal budget');

-- Sample KPIs
INSERT INTO kpis (hod_id, kpi_name, target_value, achieved_value, unit, period, status) VALUES
(1, 'Farmers Benefited', 100000, 75000, 'Count', 'Quarterly', 'on_track'),
(2, 'Man-days Generated', 500000, 380000, 'Days', 'Quarterly', 'on_track'),
(3, 'Projects Completed', 50, 32, 'Count', 'Yearly', 'at_risk'),
(4, 'Patients Treated', 200000, 180000, 'Count', 'Quarterly', 'on_track'),
(5, 'Schools Covered', 5000, 4500, 'Count', 'Yearly', 'on_track');

-- Sample Nodal Officers
INSERT INTO nodal_officers (name, designation, department, scheme_id, email, phone, status) VALUES
('Ramesh Babu', 'Nodal Officer', 'Agriculture', 1, 'ramesh.babu@gov.in', '9876543230', 'active'),
('Sita Devi', 'Nodal Officer', 'Rural Development', 2, 'sita.devi@gov.in', '9876543231', 'active'),
('Ganesh Kumar', 'Nodal Officer', 'Urban Planning', 3, 'ganesh.kumar@gov.in', '9876543232', 'active'),
('Anitha Rao', 'Nodal Officer', 'Health & Welfare', 4, 'anitha.rao@gov.in', '9876543233', 'active'),
('Bharat Singh', 'Nodal Officer', 'Education', 5, 'bharat.singh@gov.in', '9876543234', 'active');

-- Sample Attendance (for last 7 days)
INSERT INTO attendance (staff_id, hod_id, date, status, check_in, check_out) VALUES
(1, 1, CURDATE(), 'present', '09:00:00', '18:00:00'),
(2, 2, CURDATE(), 'present', '09:15:00', '18:30:00'),
(3, 3, CURDATE(), 'present', '09:00:00', '17:45:00'),
(4, 4, CURDATE(), 'absent', NULL, NULL),
(5, 5, CURDATE(), 'present', '09:30:00', '18:00:00'),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present', '09:00:00', '18:00:00'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present', '09:00:00', '18:00:00'),
(3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'half_day', '09:00:00', '13:00:00');

-- Sample Revenue
INSERT INTO revenue (hod_id, scheme_id, amount, source, category, date, description) VALUES
(1, 1, 15000000.00, 'Government Grant', 'Agriculture', '2024-12-01', 'Q4 allocation'),
(2, 2, 20000000.00, 'Central Fund', 'Employment', '2024-12-01', 'MGNREGA funds'),
(3, 3, 30000000.00, 'State Budget', 'Infrastructure', '2024-12-01', 'Smart city funds'),
(4, 4, 25000000.00, 'Central Fund', 'Healthcare', '2024-12-01', 'Health scheme funds'),
(5, 5, 10000000.00, 'Government Grant', 'Education', '2024-12-01', 'MDM funds'),
(1, 6, 12000000.00, 'Central Fund', 'Agriculture', '2024-11-15', 'PM-KISAN allocation'),
(3, 7, 8000000.00, 'State Budget', 'Sanitation', '2024-11-20', 'Swachh Bharat funds');

-- Sample Users (using plain text passwords for demo)
-- In production, use proper password hashing with bcrypt
INSERT INTO users (username, password, email, role, hod_id, staff_id, name, status) VALUES
('admin', 'password123', 'admin@gov.in', 'admin', NULL, NULL, 'Admin User', 'active'),
('hod1', 'password123', 'rajesh.kumar@gov.in', 'hod', 1, NULL, 'Dr. Rajesh Kumar', 'active'),
('hod2', 'password123', 'priya.sharma@gov.in', 'hod', 2, NULL, 'Smt. Priya Sharma', 'active'),
('staff1', 'password123', 'amit.patel@gov.in', 'staff', 1, 1, 'Amit Patel', 'active'),
('staff2', 'password123', 'sneha.reddy@gov.in', 'staff', 2, 2, 'Sneha Reddy', 'active');

-- Note: For demo purposes, passwords are set to 'password123' for all users (plain text)
-- In production, use proper password hashing with bcrypt

-- Sample Categories
INSERT INTO categories (name, description, status) VALUES
('Agriculture', 'Agriculture and related departments', 'active'),
('Rural Development', 'Rural development and welfare', 'active'),
('Urban Planning', 'Urban planning and infrastructure', 'active'),
('Health & Welfare', 'Health and welfare departments', 'active'),
('Education', 'Education and training departments', 'active'),
('Employment', 'Employment and skill development', 'active'),
('Infrastructure', 'Infrastructure development', 'active'),
('Sanitation', 'Sanitation and cleanliness', 'active');

-- Sample States (from telangana_db)
INSERT INTO states (id, name, status) VALUES
(1, 'Telangana', 1);

-- Sample Districts (from telangana_db - first 10)
INSERT INTO districts (id, name, state_id, status) VALUES
(2, 'Jagtial', 1, 1),
(3, 'Kumaram Bheem Asifabad', 1, 1),
(4, 'Mancherial', 1, 1),
(5, 'Adilabad', 1, 1),
(6, 'Nirmal', 1, 1),
(7, 'Nizamabad', 1, 1),
(8, 'Kamareddy', 1, 1),
(9, 'Peddapalli', 1, 1),
(10, 'Karimnagar', 1, 1),
(11, 'Rajanna Sircilla', 1, 1);

-- Sample Mandals (from telangana_db - first 20)
INSERT INTO mandals (id, name, district_id, status) VALUES
(1, 'Adilabad', 5, 1),
(2, 'Adilabad (rural)', 5, 1),
(3, 'Adilabad (urban)', 5, 1),
(58, 'Beerpur', 2, 1),
(59, 'Bheemaram', 2, 1),
(60, 'Buggaram', 2, 1),
(61, 'Dharmapuri', 2, 1),
(62, 'Gollapalle', 2, 1),
(63, 'Ibrahimpatnam', 2, 1),
(64, 'Jagtial', 2, 1),
(65, 'Jagtial rural', 2, 1),
(66, 'Kodimial', 2, 1),
(67, 'Koratla', 2, 1),
(68, 'Kothlapur', 2, 1),
(69, 'Mallapur', 2, 1),
(70, 'Mallial', 2, 1),
(71, 'Medipalle', 2, 1),
(72, 'Metpalle', 2, 1),
(73, 'Pegadapalle', 2, 1),
(74, 'Raikal', 2, 1);
