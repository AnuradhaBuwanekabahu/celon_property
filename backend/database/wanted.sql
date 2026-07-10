USE ceylone_property;

CREATE TABLE wanted (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    budget DECIMAL(12,2),

    preferred_city VARCHAR(100),

    phone_number VARCHAR(20) NOT NULL,

    main_image VARCHAR(255),

    images JSON,

    status ENUM(
        'pending',
        'active',
        'closed'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(client_id)

    REFERENCES clients(id)

    ON DELETE CASCADE

);