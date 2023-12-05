CREATE VIEW post_view AS
SELECT
    p.title,
    p.content,
    p.created_at,
    u.username,
    t.title AS topic_title

FROM
    posts p
JOIN
    topics t ON p.topic_id = t.topic_id
JOIN
    users u ON p.user_id = u.user_id;