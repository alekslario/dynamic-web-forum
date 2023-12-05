CREATE TABLE users_topics (
    user_topic INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    topic_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
    -- Add more columns as needed for additional post information
);