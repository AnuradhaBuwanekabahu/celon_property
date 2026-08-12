USE ceylone_property;

CREATE TABLE stays_to_buy (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    overview JSON,

    price DECIMAL(12,2) NOT NULL,

    property_type VARCHAR(50) NOT NULL,

    highlights JSON,

    area_sqft DECIMAL(10,2),

   


    duration  ENUM (
        'permanent',
        'month',
        'year',
        'week',
        'day'
    ),

    city VARCHAR(100) NOT NULL,

    map_address VARCHAR(255),

    rate DECIMAL(2,1) DEFAULT 0.0,


    location VARCHAR(255),

    main_image  longblob NOT NULL,
     main_video LONGBLOB NULL,

    images JSON,

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

USE ceylone_property;

ALTER TABLE stays_to_buy
DROP COLUMN images;

CREATE TABLE stays_to_buy_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stays_to_buy_id INT NOT NULL,
    image LONGBLOB NOT NULL,
    image_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (stays_to_buy_id)
    REFERENCES stays_to_buy(id)
    ON DELETE CASCADE
);

ALTER TABLE stays_to_buy
ADD COLUMN main_image_type VARCHAR(100);


ALTER TABLE stays_to_buy
ADD COLUMN main_video_type VARCHAR(100);



ALTER TABLE stays_to_buy
DROP COLUMN main_image_type;

ALTER TABLE stays_to_buy
DROP COLUMN main_video_type;

ALTER TABLE stays_to_buy_images
DROP COLUMN image_type;

