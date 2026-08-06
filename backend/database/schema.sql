-- Ceylone Property Database Schema for MySQL
-- Execute this script in MySQL Workbench or MySQL CLI to create the entire database structure.

CREATE DATABASE IF NOT EXISTS ceylone_property;
USE ceylone_property;

-- 1. Admins Table (Supports both Superadmin and Admin roles)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') DEFAULT 'admin',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients Table (Property Sellers / Advertisers)
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    whatsapp_number VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    ads_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Users Table (End Users / Buyers)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(100) NOT NULL UNIQUE,
    rate INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Hot Sales Properties Table
CREATE TABLE IF NOT EXISTS hot_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    overview JSON,
    highlights JSON,
    area_sqft DECIMAL(10,2),
    city VARCHAR(100) NOT NULL,
    map_address VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    main_image LONGBLOB NOT NULL,
    rate DECIMAL(2,1) DEFAULT 0.0,
    status ENUM('pending', 'active', 'rejected', 'sold') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Hot Sale Additional Images
CREATE TABLE IF NOT EXISTS hot_sale_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hot_sale_id INT NOT NULL,
    image LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(hot_sale_id) REFERENCES hot_sales(id) ON DELETE CASCADE
);

-- 5. Stays To Buy Properties Table
CREATE TABLE IF NOT EXISTS stays_to_buy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    overview JSON,
    price DECIMAL(12,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    highlights JSON,
    area_sqft DECIMAL(10,2),
    main_video LONGBLOB,
    duration ENUM('permanent', 'month', 'year', 'week', 'day') DEFAULT 'month',
    city VARCHAR(100) NOT NULL,
    map_address VARCHAR(255),
    rate DECIMAL(2,1) DEFAULT 0.0,
    location VARCHAR(255),
    main_image LONGBLOB NOT NULL,
    images JSON,
    status ENUM('pending', 'active', 'rejected', 'sold') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 6. Stays To Rent Properties Table
CREATE TABLE IF NOT EXISTS stays_to_rent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    overview JSON,
    main_video LONGBLOB,
    duration ENUM('permanent', 'month', 'year', 'week', 'day') DEFAULT 'month',
    property_type VARCHAR(50) NOT NULL,
    highlights JSON,
    rate DECIMAL(2,1) DEFAULT 0.0,
    area_sqft DECIMAL(10,2),
    city VARCHAR(100) NOT NULL,
    map_address VARCHAR(255),
    location VARCHAR(255),
    main_image LONGBLOB NOT NULL,
    images JSON,
    price_period ENUM('monthly', 'yearly') DEFAULT 'monthly',
    status ENUM('pending', 'active', 'rejected', 'rented') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 7. Land Properties Table
CREATE TABLE IF NOT EXISTS land (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    overview JSON,
    rate INT DEFAULT 0,
    land_size DECIMAL(10,2) NOT NULL,
    main_video LONGBLOB,
    duration ENUM('permanent', 'month', 'year', 'week', 'day') DEFAULT 'permanent',
    size_unit ENUM('perches', 'acres', 'sqft') DEFAULT 'perches',
    location VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    main_image LONGBLOB NOT NULL,
    status ENUM('pending', 'active', 'rejected', 'sold') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Land Additional Images
CREATE TABLE IF NOT EXISTS land_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    image LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (land_id) REFERENCES land(id) ON DELETE CASCADE
);

-- 8. Wanted Listings Table
CREATE TABLE IF NOT EXISTS wanted (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    budget DECIMAL(12,2),
    preferred_city VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL,
    main_image VARCHAR(255),
    images JSON,
    status ENUM('pending', 'active', 'rejected', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 9. Advertisements Table
CREATE TABLE IF NOT EXISTS ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    image LONGBLOB NOT NULL,
    link_url VARCHAR(255),
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    property_type ENUM('hot_sales', 'stays_to_buy', 'stays_to_rent', 'wanted', 'land') NOT NULL,
    property_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR',
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(150),
    payment_gateway VARCHAR(50),
    paid_at DATETIME,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Seed Initial Superadmin Account (Default password: SuperAdmin123!)
INSERT INTO admins (name, email, password, role, is_approved)
VALUES ('Super Admin', 'superadmin@ceyloneproperty.com', '$2b$10$GhteKv4EeZm.CnmfBz.QKeITzwj6OcWWNdYXI1oyOXqBeUsdFl72.', 'superadmin', TRUE)
ON DUPLICATE KEY UPDATE role='superadmin', is_approved=TRUE;
