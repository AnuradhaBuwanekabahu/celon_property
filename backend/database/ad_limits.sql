CREATE TABLE IF NOT EXISTS ad_limits (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    free_ad_limit           INT             NOT NULL DEFAULT 5,
    second_limit            INT             NOT NULL DEFAULT 10,
    second_limit_charge     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    third_limit             INT             NOT NULL DEFAULT 20,
    third_limit_charge      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    created_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_limits (free_ad_limit, second_limit, third_limit)
);

INSERT INTO ad_limits (id, free_ad_limit, second_limit, second_limit_charge, third_limit, third_limit_charge)
VALUES (1, 5, 10, 0.00, 20, 0.00)
ON DUPLICATE KEY UPDATE id=1;