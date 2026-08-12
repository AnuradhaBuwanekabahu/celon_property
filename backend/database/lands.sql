USE ceylone_property;

CREATE TABLE land (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    price DECIMAL(12,2) NOT NULL,
    overview JSON,
    rate int,
    
    land_size DECIMAL(10,2) NOT NULL,

     main_video LONGBLOB,


    duration  ENUM (
        'permanent',
        'month',
        'year',
        'week',
        'day'
    ),

    size_unit ENUM(
        'perches',
        'acres',
        'sqft'
    ) DEFAULT 'perches',

    


    location VARCHAR(150),

    city VARCHAR(100) NOT NULL,

    main_image LONGBLOB NOT NULL,

    status ENUM(
        'pending',
        'active',
        'sold'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE

);

CREATE TABLE land_images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    land_id INT NOT NULL,

    image LONGBLOB NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (land_id)
    REFERENCES land(id)
    ON DELETE CASCADE

);


ALTER TABLE land
ADD COLUMN main_image_type VARCHAR(100);


ALTER TABLE land
ADD COLUMN main_video_type VARCHAR(100);


ALTER TABLE land_images
ADD COLUMN image_type VARCHAR(100);

ALTER TABLE land
DROP COLUMN main_image_type;

ALTER TABLE land
DROP COLUMN main_video_type;

ALTER TABLE land_images
DROP COLUMN image_type;

ALTER TABLE land
MODIFY COLUMN rate DECIMAL(12,2) DEFAULT 0.00;