

CREATE TABLE land (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    limit_id INT NULL,
    title VARCHAR(150) NOT NULL,
    rate DECIMAL(12,2) DEFAULT 0.00,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    overview JSON,
    land_size DECIMAL(10,2) NOT NULL,
    size_unit ENUM('perches','acres','sqft') DEFAULT 'perches',
    duration ENUM('permanent','month','year','week','day') DEFAULT 'month',
    days INT NOT NULL,
    expires_at TIMESTAMP NULL,
    address VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    map_address VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    main_image LONGBLOB NOT NULL,
    main_video LONGBLOB,
    status ENUM('pending','active','sold','expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (limit_id) REFERENCES limits(id)
);
CREATE TABLE land_images (
    
    id INT AUTO_INCREMENT PRIMARY KEY,
    land_id INT NOT NULL,
    image LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (land_id) REFERENCES land(id) ON DELETE CASCADE
);