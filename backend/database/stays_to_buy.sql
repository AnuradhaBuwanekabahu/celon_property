USE ceylone_property;

CREATE TABLE stays_to_buy (
    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,
    limit_id INT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    overview JSON,
    price DECIMAL(12,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    highlights JSON,

    area_sqft DECIMAL(10,2),
    main_video LONGBLOB,

    duration ENUM(
        'permanent',
        'month',
        'year',
        'week',
        'day'
    ),

    days INT NOT NULL,
    expires_at TIMESTAMP NULL,

    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    map_address VARCHAR(255),

    rate DECIMAL(2,1) DEFAULT 0.0,

    main_image LONGBLOB NOT NULL,

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

CREATE TABLE stay_to_buy_images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    stay_buy_id INT NOT NULL,

    image LONGBLOB NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(stay_buy_id)

    REFERENCES stays_to_buy(id)

    ON DELETE CASCADE

);