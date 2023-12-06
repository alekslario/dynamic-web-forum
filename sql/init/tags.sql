CREATE TABLE IF NOT EXISTS tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(50) NOT NULL,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
    -- Add more columns as needed for additional post information
);