module.exports = function (app, shopData, baseUrl) {
  app.get("/search_post", function (req, res) {
    res.render("search_post.ejs");
  });

  app.get("/add_post", function (req, res) {
    let sqlquery = "SELECT * FROM topics"; // query database to get all the books // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      } else {
        res.render("add_post.ejs", { topics: result });
      }
    });
  });
  app.post("/search_post", function (req, res) {
    const { query } = req.body;

    // Assuming you have a 'posts' table with a 'title' column
    let sqlquery = "SELECT * FROM posts WHERE title LIKE ?";

    // Adding '%' to the query for a simple 'contains' search
    const searchTerm = `%${query}%`;

    db.query(sqlquery, [searchTerm], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error searching for posts");
      } else {
        res.render("search_results.ejs", { posts: result, query: query });
      }
    });
  });

  app.get("/post", function (req, res) {
    const postId = req.query.post_id; // Assuming post_id is passed as a query parameter

    let sqlquery = `SELECT * FROM post_view WHERE post_id = ?;`;

    db.query(sqlquery, [postId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching post details");
      } else {
        if (result.length > 0) {
          //query for tags
          let sqlquery = `
          SELECT
              tags.tag_name
          FROM
              tags
          WHERE
              tags.post_id = ?;`;
          db.query(sqlquery, [postId], (err, tagsResult) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error fetching post details");
            } else {
              const postDetails = {
                post_id: result[0].post_id,
                post_title: result[0].post_title,
                content: result[0].content,
                created_at: result[0].created_at,
                topic_title: result[0].topic_title,
                author: {
                  user_id: result[0].author_id,
                  username: result[0].author_username,
                },
                replies: result
                  .map((row) => ({
                    user_id: row.reply_user_id,
                    username: row.reply_username,
                    content: row.reply_content,
                  }))
                  .filter((reply) => reply.user_id !== null),
                tags: tagsResult
                  .map((row) => row.tag_name)
                  .filter((tag) => tag !== null),
              };

              res.render("post.ejs", { postDetails: postDetails });
            }
          });
        } else {
          res.status(404).send("Post not found");
        }
      }
    });
  });

  app.get("/posts", function (req, res) {
    let sqlquery = `
       SELECT * FROM post_summary_view;
    `; // query database to get all the books // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect(baseUrl);
      }
      res.render("posts.ejs", { posts: result });
    });
  });

  app.post("/delete_post", function (req, res) {
    const { post_id } = req.body;

    // Assuming you have a 'posts' table with a column 'post_id'
    const sqlQuery = "CALL DeletePost(?)";

    db.query(sqlQuery, [post_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting the post");
      } else {
        res.redirect(baseUrl + "posts");
      }
    });
  });

  app.post("/add_post_callback", function (req, res) {
    const { title, topic, content, tags } = req.body;
    const userTokenCookie = req.cookies.userToken;
    if (!userTokenCookie) {
      res.status(401).send("User not logged in");
      return;
    }
    const [username, password] = userTokenCookie.split("|||");
    // Query the database to find a user with the provided username and password
    db.query(
      "SELECT user_id FROM users WHERE username = ? AND password_hash = ?",
      [username, password],
      (err, userResult) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error adding new post");
        } else {
          if (userResult.length > 0) {
            // User found, get the user_id
            const userId = userResult[0].user_id;

            // now check if the user is a me member of the topic
            db.query(
              "SELECT * FROM users_topics WHERE user_id = ? AND topic_id = ?",
              [userId, topic],
              (err, existingResult) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error adding new post");
                } else {
                  if (existingResult.length > 0) {
                    // Assuming you have a 'posts' table with appropriate columns (e.g., title, topic_id, content, user_id, etc.)
                    let sqlquery =
                      "INSERT INTO posts (title, topic_id, content, user_id) VALUES (?, ?, ?, ?)";

                    db.query(
                      sqlquery,
                      [title, topic, content, userId],
                      (err, postResult) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error adding new post");
                        } else {
                          //insert tags
                          if (tags) {
                            const post_id = postResult.insertId;
                            const tagsArray = tags.split(",");
                            let sqlquery =
                              "INSERT INTO tags (tag_name, post_id) VALUES" +
                              tagsArray
                                .map((tag) => ` ('${tag}', ${post_id})`)
                                .join(",") +
                              ";";
                            db.query(sqlquery, (err, tagResult) => {
                              if (err) {
                                console.error(err);
                                res.status(500).send("Error adding tags");
                              } else {
                                // Redirect the user back to the list of posts
                                res.redirect(baseUrl + "posts");
                              }
                            });
                          } else {
                            // Redirect the user back to the list of posts
                            res.redirect(baseUrl + "posts");
                          }
                        }
                      }
                    );
                  } else {
                    // User is not a member of the topic, handle accordingly (e.g., show a message)
                    res.status(403).send("User is not a member of the topic");
                  }
                }
              }
            );
          } else {
            res.status(401).send("Invalid username or password");
          }
        }
      }
    );
  });

  app.post("/add_reply_callback", function (req, res) {
    const { content, post_id } = req.body;
    const userTokenCookie = req.cookies.userToken;

    if (!userTokenCookie) {
      res.status(401).send("User not logged in");
      return;
    }
    const [username, password] = userTokenCookie.split("|||");

    // Query the database to find a user with the provided username and password
    db.query(
      "SELECT user_id FROM users WHERE username = ? AND password_hash = ?",
      [username, password],
      (err, userResult) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error adding new reply");
        } else {
          if (userResult.length > 0) {
            // User found, get the user_id
            const userId = userResult[0].user_id;

            // Assuming you have a 'replies' table with appropriate columns (e.g., user_id, post_id, content, etc.)
            let sqlquery =
              "INSERT INTO replies (user_id, post_id, content) VALUES (?, ?, ?)";

            db.query(
              sqlquery,
              [userId, post_id, content],
              (err, replyResult) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error adding new reply");
                } else {
                  // Redirect the user back to the post or wherever you prefer
                  res.redirect(`${baseUrl}post?post_id=${post_id}`);
                }
              }
            );
          } else {
            res.status(401).send("Invalid username or password");
          }
        }
      }
    );
  });
};
