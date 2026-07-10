USE ceylone_property;

CREATE TABLE land (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    price DECIMAL(12,2) NOT NULL,

    land_size DECIMAL(10,2) NOT NULL,

    size_unit ENUM(
        'perches',
        'acres',
        'sqft'
    ) DEFAULT 'perches',

    location VARCHAR(150),

    city VARCHAR(100) NOT NULL,

    main_image VARCHAR(255) NOT NULL,

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