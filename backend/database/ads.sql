CREATE TABLE ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    image LONGBLOB NOT NULL,
    link_url VARCHAR(255),
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE
);


ALTER TABLE ads
ADD COLUMN image_type VARCHAR(50);

ALTER TABLE ads
DROP COLUMN image_type;


SHOW VARIABLES LIKE 'secure_file_priv';
INSERT INTO ads
(
client_id,
title,
image,
image_type,
link_url,
position
)
VALUES
(
1,
'Ceylon Property Banner',
LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/sample.jpg'),
'image/jpeg',
'https://example.com',
1
);