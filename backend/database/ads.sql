CREATE TABLE IF NOT EXISTS ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    image LONGBLOB NOT NULL,
    link_url VARCHAR(255),
    position VARCHAR(50) DEFAULT 'sub_pages',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE
);
