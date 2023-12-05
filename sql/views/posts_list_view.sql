CREATE VIEW posts_list_view AS
SELECT
    p.title,
    p.created_at,
    u.username
FROM
    posts p
JOIN
    users u ON p.user_id = u.user_id
ORDER BY
    p.created_at DESC;
