
CREATE TABLE hot_sales (

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

    location VARCHAR(255) NOT NULL,

    main_image LONGBLOB NOT NULL,

    status ENUM(
        'pending',
        'active',
        'sold'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE

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