DELIMITER //

CREATE PROCEDURE DeletePost(IN postIdToDelete INT)
BEGIN
  
    -- Delete replies associated with the post
    DELETE FROM replies WHERE post_id = postIdToDelete;

    DELETE FROM tags WHERE post_id = postIdToDelete;

    -- Delete the post
    DELETE FROM posts WHERE post_id = postIdToDelete;

END //

DELIMITER ;