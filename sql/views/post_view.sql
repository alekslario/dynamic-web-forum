CREATE VIEW post_view AS
SELECT
    posts.post_id,
    posts.title AS post_title,
    posts.content,
    posts.created_at,
    topics.title AS topic_title,
    users.user_id AS author_id,
    users.username AS author_username,
    replies.user_id AS reply_user_id,
    reply_users.username AS reply_username,
    replies.content AS reply_content
FROM
    posts
JOIN
    topics ON posts.topic_id = topics.topic_id
JOIN
    users ON posts.user_id = users.user_id
LEFT JOIN
    replies ON posts.post_id = replies.post_id
LEFT JOIN
    users AS reply_users ON replies.user_id = reply_users.user_id;