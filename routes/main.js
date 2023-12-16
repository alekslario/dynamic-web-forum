const post = require("./post");
module.exports = function (app, shopData, baseUrl) {
  // handle post routes
  post(app, shopData, baseUrl);
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

  app.get("/users", function (req, res) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the books // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect(baseUrl);
      }
      res.render("users.ejs", { users: result });
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
