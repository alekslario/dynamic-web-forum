CREATE VIEW post_replies_view AS
SELECT
    r.content,
    r.created_at,
    u.username
FROM
    replies r
JOIN
    users u ON r.user_id = u.user_id
ORDER BY
    r.created_at DESC;