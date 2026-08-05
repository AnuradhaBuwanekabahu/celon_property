-- ================================================
-- Offers Table
-- Super Admin විසින් special offers create කරන්නට
-- ================================================

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    offer_type ENUM('percentage', 'fixed', 'free_listing', 'featured') DEFAULT 'percentage',
    applicable_to ENUM('all', 'hot_sales', 'lands', 'stays_to_buy', 'stays_to_rent', 'wanted') DEFAULT 'all',
    promo_code VARCHAR(50) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_uses INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
