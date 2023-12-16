const local = true;
const baseUrl = local ? "/" : "https://www.doc.gold.ac.uk/usr/454/";
module.exports = function (app, shopData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs");
  });
  //page for a single user with id in query
  app.get("/user", function (req, res) {
    const username = req.query.username; // Assuming user_id is passed as a query parameter
    // create sql query to get user details
    let sqlquery = `SELECT u.username, u.about, u.user_id, p.post_id, p.title FROM users u LEFT JOIN posts p ON u.user_id = p.user_id WHERE u.username = ?`;
    db.query(sqlquery, [username], (err, result) => {
      if (err) {
        res.redirect(baseUrl);
      }
      const { username, about, user_id } = result[0];

      res.render("user.ejs", {
        username,
        about,
        user_id,
        posts: result
          .map(({ post_id, title }) => ({ post_id, title }))
          .filter((post) => post.post_id !== null),
      });
    });
  });

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

  app.get("/users", function (req, res) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the books // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect(baseUrl);
      }
      res.render("users.ejs", { users: result });
    });
  });
  app.get("/post", function (req, res) {
    const postId = req.query.post_id; // Assuming post_id is passed as a query parameter

    let sqlquery = `
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
            users AS reply_users ON replies.user_id = reply_users.user_id
        WHERE
            posts.post_id = ?;
    `;

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

  app.get("/topics", function (req, res) {
    let sqlquery = "SELECT * FROM topics";
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect(baseUrl);
      } else {
        res.render("topics.ejs", { topics: result });
      }
    });
  });

  app.get("/topic", function (req, res) {
    // Retrieve the topic_id from the query parameters
    const topicId = req.query.topic_id;

    // Use a parameterized query to select all columns for the specified topic_id
    let sqlquery = `
    SELECT topics.*, users.username
    FROM topics
    LEFT JOIN users_topics ON topics.topic_id = users_topics.topic_id
    LEFT JOIN users ON users_topics.user_id = users.user_id
    WHERE topics.topic_id = ?;
  `;

    db.query(sqlquery, [topicId], (err, result) => {
      if (err) {
        console.error(err);
        res.redirect(baseUrl);
      } else {
        db.query(
          "SELECT title, post_id FROM posts WHERE topic_id = ?",
          [topicId],
          (err, postsResult) => {
            if (err) {
              console.error(err);
              res.redirect(baseUrl);
            } else {
              // Assuming result is an array with the topic details

              const topicDetails = result;

              // Extract usernames into an array
              const usernames = topicDetails
                .map((row) => row.username)
                .filter((username) => username !== null);

              // Extract posts into an array

              // Render the topic page with topic details
              res.render("topic.ejs", {
                topicDetails: topicDetails,
                usernames: usernames,
                posts: postsResult,
              });
            }
          }
        );
      }
    });
  });

  app.post("/topic_callback", function (req, res) {
    // Retrieve the data from the form
    const { topic_id } = req.body;
    const userToken = req.cookies.userToken;
    if (!userToken) {
      res.status(401).send("User not logged in");
      return;
    }
    const [username, password] = userToken.split("|||");

    // Query the database to find a user with the provided username and password
    db.query(
      "SELECT user_id FROM users WHERE username = ? AND password_hash = ?",
      [username, password], // Assuming you store passwords as plain text for this example
      (err, userResult) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error joining topic");
        } else {
          if (userResult.length > 0) {
            // User found, get the user_id
            const user_id = userResult[0].user_id;

            // Check if the user is already a member of the topic
            db.query(
              "SELECT * FROM users_topics WHERE user_id = ? AND topic_id = ?",
              [user_id, topic_id],
              (err, existingResult) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error joining topic");
                } else {
                  if (existingResult.length === 0) {
                    // User is not yet a member, insert into users_topics
                    db.query(
                      "INSERT INTO users_topics (user_id, topic_id) VALUES (?, ?)",
                      [user_id, topic_id],
                      (err, joinResult) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error joining topic");
                        } else {
                          res.cookie("userToken", userToken, {
                            maxAge: 900000,
                          });
                          // Redirect the user back to the topic or wherever you prefer
                          res.redirect(`${baseUrl}topic?topic_id=${topic_id}`);
                        }
                      }
                    );
                  } else {
                    // User is already a member, handle accordingly (e.g., show a message)
                    res
                      .status(409)
                      .send("User is already a member of the topic");
                  }
                }
              }
            );
          } else {
            // User not found or invalid credentials
            res.status(401).send("Invalid username or password");
          }
        }
      }
    );
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });
  app.get("/login", function (req, res) {
    res.render("login.ejs");
  });
  app.get("/logout_callback", function (req, res) {
    res.clearCookie("userToken");
    res.redirect(baseUrl);
  });
  app.post("/login_callback", function (req, res) {
    const { username, password } = req.body;
    const userToken = username + "|||" + password;
    // Query the database to find a user with the provided username and password
    db.query(
      "SELECT user_id FROM users WHERE username = ? AND password_hash = ?",
      [username, password], // Assuming you store passwords as plain text for this example
      (err, userResult) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error logging in");
        } else {
          if (userResult.length > 0) {
            // Set the 'userToken' cookie to the generated token
            // usually doesn't really really works like that, dummy token
            res.cookie("userToken", userToken, { maxAge: 900000 });

            // Redirect the user back to the home page
            res.redirect(baseUrl);
          } else {
            // User not found or invalid credentials
            res.status(401).send("Invalid username or password");
          }
        }
      }
    );
  });
  app.post("/register_callback", function (req, res) {
    const { username, password, about, email } = req.body;
    const userToken = username + "|||" + password;
    // Assuming you have a 'users' table with appropriate columns (e.g., username, password, about, email)
    let sqlquery =
      "INSERT INTO users (username, password_hash, about, email) VALUES (?, ?, ?, ?)";

    // Execute the query to insert user data into the 'users' table
    db.query(sqlquery, [username, password, about, email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error registering user");
      } else {
        // Set the 'userToken' cookie to the generated token
        // usually doesn't really really works like that, dummy token
        res.cookie("userToken", userToken, { maxAge: 900000 });

        // Redirect the user to the users page after successful registration
        res.redirect(baseUrl + "users");
      }
    });
  });
};
