CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    about TEXT,
    -- Generally, you should not store passwords in plain text, but for this example we will
    password_hash VARCHAR(25) NOT NULL
);