USE ceylone_property;

CREATE TABLE wanted (
    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,
    limit_id INT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    budget DECIMAL(12,2),
    preferred_city VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL,

    days INT NOT NULL DEFAULT 30,
    expires_at TIMESTAMP NULL,

    status ENUM(
        'pending',
        'active',
        'closed',
        'expired'
    ) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    FOREIGN KEY (limit_id)
        REFERENCES limits(id)
);