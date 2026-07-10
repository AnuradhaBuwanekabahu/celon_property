USE ceylone_property;

CREATE TABLE stays_to_rent (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    price DECIMAL(12,2) NOT NULL,

    property_type VARCHAR(50) NOT NULL,

    highlights JSON,

    area_sqft DECIMAL(10,2),

    city VARCHAR(100) NOT NULL,

    map_address VARCHAR(255),

    location VARCHAR(255),

    main_image VARCHAR(255) NOT NULL,

    images JSON,

    price_period ENUM(
        'monthly',
        'yearly'
    ) DEFAULT 'monthly',

    status ENUM(
        'pending',
        'active',
        'rented'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(client_id)

    REFERENCES clients(id)

    ON DELETE CASCADE

);