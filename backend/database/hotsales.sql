CREATE TABLE hot_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,
    limit_id INT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,

    overview JSON,
    highlights JSON,

    area_sqft DECIMAL(10,2),
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    map_address VARCHAR(255),

    main_video LONGBLOB,
    main_image LONGBLOB NOT NULL,

    duration ENUM(
        'permanent',
        'month',
        'year',
        'week',
        'day'
    ),

    selected_days INT NOT NULL,
    expires_at TIMESTAMP NULL,

    rate DECIMAL(2,1) DEFAULT 0.0,

    status ENUM(
        'pending',
        'active',
        'sold',
        'expired'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    FOREIGN KEY (limit_id)
        REFERENCES limits(id)
);

CREATE TABLE hot_sale_images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    hot_sale_id INT NOT NULL,

    image LONGBLOB NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(hot_sale_id)

    REFERENCES hot_sales(id)

    ON DELETE CASCADE

);