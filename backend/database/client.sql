USE ceylone_property;

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    google_id VARCHAR(100) NULL UNIQUE,
    auth_type ENUM('email', 'google') NOT NULL DEFAULT 'email',
    phone_number VARCHAR(20),
    avatar LONGBLOB,
    whatsapp_number VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    ads_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_otp (email, otp_code)
);