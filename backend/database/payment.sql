CREATE TABLE payments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    client_id INT NOT NULL,

    property_type ENUM(
        'hot_sales',
        'stays_to_buy',
        'stays_to_rent',
        'wanted',
        'land'
    ) NOT NULL,

    property_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    currency VARCHAR(10) DEFAULT 'LKR',

    payment_method VARCHAR(50),

    transaction_ref VARCHAR(150),

    payment_gateway VARCHAR(50),

    paid_at DATETIME,

    status ENUM(
        'pending',
        'paid',
        'failed',
        'refunded'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE

);