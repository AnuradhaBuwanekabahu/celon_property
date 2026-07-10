USE ceylone_property;

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

    payment_method VARCHAR(50),

    transaction_ref VARCHAR(150),

    status ENUM(
        'pending',
        'paid',
        'failed'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_payment_client

    FOREIGN KEY(client_id)

    REFERENCES clients(id)

    ON DELETE CASCADE

);