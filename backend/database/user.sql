USE ceylone_property;

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    google_id VARCHAR(100) NOT NULL UNIQUE,
    
    rate int,
    

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);