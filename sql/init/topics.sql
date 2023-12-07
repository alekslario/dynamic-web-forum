CREATE TABLE IF NOT EXISTS topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    details TEXT,
    some_text TEXT
    -- Add more columns as needed for additional post information
);