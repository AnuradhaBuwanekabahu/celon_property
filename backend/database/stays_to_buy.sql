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

    city VARCHAR(100) NOT NULL,

    map_address VARCHAR(255),

    rate DECIMAL(2,1) DEFAULT 0.0,


    location VARCHAR(255),

    main_image  longblob NOT NULL,
   

    images JSON,

    status ENUM(
        'pending',
        'active',
        'sold'
    ) DEFAULT 'pending',

    duration ENUM(
       'year',
       'month',
       'day'
    ) DEFAULT 'month',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(client_id)

    REFERENCES clients(id)

    ON DELETE CASCADE

);