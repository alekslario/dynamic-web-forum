CREATE VIEW post_summary_view AS
SELECT
    posts.post_id,
    posts.title AS post_title,
    posts.content,
    posts.created_at,
    topics.title AS topic_title,
    users.username,
    COUNT(replies.reply_id) AS reply_count
FROM
    posts
JOIN
    topics ON posts.topic_id = topics.topic_id
JOIN
    users ON posts.user_id = users.user_id
LEFT JOIN
    replies ON posts.post_id = replies.post_id
GROUP BY
    posts.post_id
ORDER BY
    posts.created_at DESC;