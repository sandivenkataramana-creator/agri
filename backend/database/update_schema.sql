-- Migration script to add new tables and columns
-- Run this if you already have an existing database

-- Add categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add category_id to hods table if it doesn't exist
ALTER TABLE hods 
ADD COLUMN IF NOT EXISTS category_id INT,
ADD FOREIGN KEY IF NOT EXISTS (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add category_id to staff table if it doesn't exist
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS category_id INT,
ADD FOREIGN KEY IF NOT EXISTS (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add category_id to schemes table if it doesn't exist
ALTER TABLE schemes 
ADD COLUMN IF NOT EXISTS category_id INT,
ADD FOREIGN KEY IF NOT EXISTS (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add location fields to budget table if they don't exist
ALTER TABLE budget 
ADD COLUMN IF NOT EXISTS state_id INT,
ADD COLUMN IF NOT EXISTS district_id INT,
ADD COLUMN IF NOT EXISTS mandal_id INT,
ADD COLUMN IF NOT EXISTS village VARCHAR(255);

-- Create states table if it doesn't exist
CREATE TABLE IF NOT EXISTS states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1
);

-- Create districts table if it doesn't exist
CREATE TABLE IF NOT EXISTS districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- Create mandals table if it doesn't exist
CREATE TABLE IF NOT EXISTS mandals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    district_id INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 1,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- Add foreign keys for location fields in budget (only if columns were just added)
-- Note: MySQL doesn't support IF NOT EXISTS for foreign keys, so you may need to run these manually
-- ALTER TABLE budget ADD FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL;
-- ALTER TABLE budget ADD FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL;
-- ALTER TABLE budget ADD FOREIGN KEY (mandal_id) REFERENCES mandals(id) ON DELETE SET NULL;

-- Insert sample categories if they don't exist
INSERT IGNORE INTO categories (name, description, status) VALUES
('Agriculture', 'Agriculture and related departments', 'active'),
('Rural Development', 'Rural development and welfare', 'active'),
('Urban Planning', 'Urban planning and infrastructure', 'active'),
('Health & Welfare', 'Health and welfare departments', 'active'),
('Education', 'Education and training departments', 'active'),
('Employment', 'Employment and skill development', 'active'),
('Infrastructure', 'Infrastructure development', 'active'),
('Sanitation', 'Sanitation and cleanliness', 'active');

-- Insert Telangana state if it doesn't exist
INSERT IGNORE INTO states (id, name, status) VALUES (1, 'Telangana', 1);


