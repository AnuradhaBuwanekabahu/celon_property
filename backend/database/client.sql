USE ceylone_property;

CREATE TABLE clients (

    id INT AUTO_INCREMENT PRIMARY KEY,

    password VARCHAR(255) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone_number VARCHAR(20) ,

    avatar LONGBLOB,

    whatsapp_number VARCHAR(20),

    full_name VARCHAR(100) NOT NULL,

    ads_count INT NOT NULL DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);