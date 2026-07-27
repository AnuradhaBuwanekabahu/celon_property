CREATE DATABASE IF NOT EXISTS ceylone_property;

USE ceylone_property;

-- =========================================================
-- CLIENTS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE clients (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)         NOT NULL UNIQUE,
    password        VARCHAR(255)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    phone_number    VARCHAR(20)         NOT NULL,
    whatsapp_number VARCHAR(20)         NULL,
    full_name       VARCHAR(100)        NOT NULL,
    ads_count       INT                 NOT NULL DEFAULT 0,
    free_tier_limit INT                 NOT NULL DEFAULT 5,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_clients_username (username),
    INDEX idx_clients_email (email),
    INDEX idx_clients_phone (phone_number)
);

-- =========================================================
-- USERS TABLE (Google OAuth)
-- =========================================================
USE ceylone_property;

CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    google_id       VARCHAR(100)        NOT NULL UNIQUE,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- ADMINS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE admins (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50)         NOT NULL,
    password        VARCHAR(255)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    is_approved     BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- PAYMENTS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    property_type   ENUM('hot_sales','stays_to_buy','stays_to_rent','wanted','land') NOT NULL,
    property_id     INT                 NOT NULL,
    amount          DECIMAL(10,2)       NOT NULL,
    payment_method  VARCHAR(50)         NULL,
    transaction_ref VARCHAR(150)        NULL,
    status          ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- =========================================================
-- HOT SALES TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE hot_sales (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT                NULL,
    price           DECIMAL(12,2)       NOT NULL,
    property_type   VARCHAR(50)         NOT NULL,
    overview        JSON                NULL,
    highlights      JSON                NULL,
    area_sqft       DECIMAL(10,2)       NULL,
    city            VARCHAR(100)        NOT NULL,
    map_address     VARCHAR(255)        NULL,
    location        VARCHAR(255)        NOT NULL,
    main_image      LONGBLOB            NOT NULL,
    rate            DECIMAL(2,1)        DEFAULT 0.0,
    status          ENUM('pending','active','sold') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,

    INDEX idx_hotsales_city (city)
);

-- =========================================================
-- HOT SALE IMAGES TABLE
-- =========================================================
CREATE TABLE hot_sale_images (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    hot_sale_id     INT                 NOT NULL,
    image           LONGBLOB            NOT NULL,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(hot_sale_id) REFERENCES hot_sales(id) ON DELETE CASCADE
);

-- =========================================================
-- STAYS TO BUY TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE stays_to_buy (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT                NULL,
    overview        JSON                NULL,
    price           DECIMAL(12,2)       NOT NULL,
    property_type   VARCHAR(50)         NOT NULL,
    highlights      JSON                NULL,
    area_sqft       DECIMAL(10,2)       NULL,
    city            VARCHAR(100)        NOT NULL,
    map_address     VARCHAR(255)        NULL,
    location        VARCHAR(255)        NOT NULL,
    main_image      VARCHAR(255)        NOT NULL,
    images          JSON                NULL,
    rate            DECIMAL(2,1)        DEFAULT 0.0,
    status          ENUM('pending','active','sold') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,

    INDEX idx_staysbuy_city (city)
);

-- =========================================================
-- STAYS TO RENT TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE stays_to_rent (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT                NULL,
    price           DECIMAL(12,2)       NOT NULL,
    overview        JSON                NULL,
    property_type   VARCHAR(50)         NOT NULL,
    highlights      JSON                NULL,
    area_sqft       DECIMAL(10,2)       NULL,
    city            VARCHAR(100)        NOT NULL,
    map_address     VARCHAR(255)        NULL,
    location        VARCHAR(255)        NOT NULL,
    main_image      VARCHAR(255)        NOT NULL,
    images          JSON                NULL,
    price_period    ENUM('monthly','yearly') NOT NULL DEFAULT 'monthly',
    rate            DECIMAL(2,1)        DEFAULT 0.0,
    status          ENUM('pending','active','rented') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,

    INDEX idx_staysrent_city (city)
);

-- =========================================================
-- WANTED TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE wanted (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT                NULL,
    budget          DECIMAL(12,2)       NULL,
    preferred_city  VARCHAR(100)        NULL,
    phone_number    VARCHAR(20)         NOT NULL,
    main_image      VARCHAR(255)        NULL,
    images          JSON                NULL,
    status          ENUM('pending','active','closed') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- =========================================================
-- LAND TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE land (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NOT NULL,
    description     TEXT                NULL,
    price           DECIMAL(12,2)       NOT NULL,
    land_size       DECIMAL(10,2)       NOT NULL,
    size_unit       ENUM('perches','acres','sqft') NOT NULL DEFAULT 'perches',
    location        VARCHAR(150)        NULL,
    city            VARCHAR(100)        NOT NULL,
    main_image      VARCHAR(255)        NOT NULL,
    images          JSON                NULL,
    status          ENUM('pending','active','sold') NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,

    INDEX idx_land_city (city)
);

-- =========================================================
-- ADS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE ads (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    title           VARCHAR(150)        NULL,
    image           LONGBLOB            NOT NULL,
    link_url        VARCHAR(255)        NULL,
    position        INT                 NOT NULL DEFAULT 0,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    is_approved     BOOLEAN             NOT NULL DEFAULT FALSE,
    approved_by     INT                 NULL,
    approved_at     TIMESTAMP           NULL,
    is_paid         BOOLEAN             NOT NULL DEFAULT FALSE,
    start_date      TIMESTAMP           NULL,
    end_date        TIMESTAMP           NULL,
    views           INT                 NOT NULL DEFAULT 0,
    clicks          INT                 NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY(approved_by) REFERENCES admins(id) ON DELETE SET NULL,

    INDEX idx_ads_client (client_id),
    INDEX idx_ads_active (is_active),
    INDEX idx_ads_approved (is_approved),
    INDEX idx_ads_dates (start_date, end_date)
);

-- =========================================================
-- AD PACKAGES TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE ad_packages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50)         NOT NULL,
    description     TEXT                NULL,
    price           DECIMAL(10,2)       NOT NULL,
    duration_days   INT                 NOT NULL,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_ad_packages_active (is_active)
);

-- =========================================================
-- AD PAYMENTS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE ad_payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    client_id       INT                 NOT NULL,
    ad_id           INT                 NOT NULL,
    package_id      INT                 NOT NULL,
    amount          DECIMAL(10,2)       NOT NULL,
    payment_method  VARCHAR(50)         NULL,
    transaction_ref VARCHAR(150)        NULL,
    status          ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
    payment_date    TIMESTAMP           NULL,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY(ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    FOREIGN KEY(package_id) REFERENCES ad_packages(id) ON DELETE CASCADE,

    INDEX idx_adpayments_client (client_id),
    INDEX idx_adpayments_status (status)
);

-- =========================================================
-- AD STATISTICS TABLE
-- =========================================================
USE ceylone_property;

CREATE TABLE ad_statistics (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    ad_id           INT                 NOT NULL,
    date            DATE                NOT NULL,
    views           INT                 NOT NULL DEFAULT 0,
    clicks          INT                 NOT NULL DEFAULT 0,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ad_stats (ad_id, date)
);

-- =========================================================
-- SAMPLE DATA
-- =========================================================
USE ceylone_property;

-- Insert sample admin
INSERT INTO admins (name, password, email, is_approved) 
VALUES ('Admin', 'admin123', 'admin@ceylone.com', TRUE);

-- Insert sample client
INSERT INTO clients (username, password, email, phone_number, whatsapp_number, full_name, ads_count, free_tier_limit) 
VALUES ('client1', 'client123', 'client@example.com', '+94771234567', '+94771234567', 'Client User', 0, 5);

-- Insert sample client 2
INSERT INTO clients (username, password, email, phone_number, whatsapp_number, full_name, ads_count, free_tier_limit) 
VALUES ('john_doe', 'password123', 'john@example.com', '+94771234568', '+94771234568', 'John Doe', 0, 5);

-- Insert sample client 3
INSERT INTO clients (username, password, email, phone_number, whatsapp_number, full_name, ads_count, free_tier_limit) 
VALUES ('jane_smith', 'password456', 'jane@example.com', '+94771234569', '+94771234569', 'Jane Smith', 0, 5);

-- Insert ad packages
INSERT INTO ad_packages (name, description, price, duration_days) VALUES
('Basic', 'Standard ad listing for 7 days', 10.00, 7),
('Premium', 'Featured ad listing for 14 days', 25.00, 14),
('VIP', 'Premium featured ad for 30 days', 50.00, 30);

-- Insert sample property
INSERT INTO hot_sales (client_id, title, description, price, property_type, overview, highlights, city, location, main_image) 
VALUES (
    1, 
    'Luxury Villa in Colombo', 
    'Beautiful 4-bedroom villa with ocean views', 
    500000.00, 
    'Villa',
    '{"bedrooms": 4, "bathrooms": 3, "pool": true, "sqft": 2500}',
    '{"features": ["Ocean View", "Pool", "Garden"]}',
    'Colombo', 
    'Colombo 03', 
    '0x1234567890abcdef'
);

-- Insert sample ad
INSERT INTO ads (client_id, title, image, link_url, position, is_active, is_approved) 
VALUES (1, 'Featured Property', '0xabcdef1234567890', '/property/1', 1, TRUE, TRUE);

-- Insert second ad (pending approval)
INSERT INTO ads (client_id, title, image, link_url, position, is_active, is_approved) 
VALUES (1, 'Luxury Villa Special', '0x1234567890abcdef', '/property/2', 2, TRUE, FALSE);

-- Insert sample ad payment
INSERT INTO ad_payments (client_id, ad_id, package_id, amount, payment_method, transaction_ref, status, payment_date) 
VALUES (1, 1, 1, 10.00, 'card', 'txn_123456', 'paid', NOW());

-- =========================================================
-- VERIFY
-- =========================================================
SHOW TABLES;

SELECT 'clients' AS Table_Name, COUNT(*) AS Count FROM clients
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'hot_sales', COUNT(*) FROM hot_sales
UNION ALL
SELECT 'ads', COUNT(*) FROM ads
UNION ALL
SELECT 'ad_packages', COUNT(*) FROM ad_packages
UNION ALL
SELECT 'ad_payments', COUNT(*) FROM ad_payments
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'land', COUNT(*) FROM land
UNION ALL
SELECT 'wanted', COUNT(*) FROM wanted
UNION ALL
SELECT 'stays_to_buy', COUNT(*) FROM stays_to_buy
UNION ALL
SELECT 'stays_to_rent', COUNT(*) FROM stays_to_rent;

USE ceylone_property;
SHOW TABLES;


