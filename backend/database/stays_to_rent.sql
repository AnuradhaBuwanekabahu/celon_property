USE ceylone_property;

DROP TABLE IF EXISTS stays_to_rent;

CREATE TABLE stays_to_rent (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    price DECIMAL(12,2) NOT NULL,

    overview JSON,

    duration ENUM(
        'permanent',
        'month',
        'year',
        'week',
        'day'
    ) DEFAULT 'month',

    property_type VARCHAR(50) NOT NULL,

    highlights JSON,

    rate DECIMAL(2,1) DEFAULT 0.0,

    area_sqft DECIMAL(10,2),

    city VARCHAR(100) NOT NULL,

    map_address VARCHAR(255),

    location VARCHAR(255),

    -- Main Image
    main_image LONGBLOB NOT NULL,
    main_image_type VARCHAR(100) NOT NULL,

    -- Main Video
    main_video LONGBLOB,
    main_video_type VARCHAR(100),

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

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE

);


CREATE TABLE stay_to_rent_images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    stay_to_rent_id INT NOT NULL,

    image LONGBLOB NOT NULL,

    image_type VARCHAR(100) NOT NULL,

    FOREIGN KEY (stay_to_rent_id)
        REFERENCES stays_to_rent(id)
        ON DELETE CASCADE

);

ALTER TABLE stays_to_rent
MODIFY COLUMN main_image_type VARCHAR(100) NULL;

ALTER TABLE stay_to_rent_images
MODIFY COLUMN image_type VARCHAR(100) NULL;

ALTER TABLE stay_to_rent_images
MODIFY COLUMN image_type VARCHAR(100) NULL;


ALTER TABLE stays_to_rent
DROP COLUMN main_image_type;

ALTER TABLE stays_to_rent
DROP COLUMN main_video_type;

ALTER TABLE stay_to_rent_images
DROP COLUMN image_type;



