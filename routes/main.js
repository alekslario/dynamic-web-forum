module.exports = function (app, shopData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs");
  });
  app.post("/registered", function (req, res) {
    // saving data in database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });

  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  app.post("/bookadded", function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"; // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This book is added to database, name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });
  app.get("/bargainbooks", function (req, res) {
    // Query books that cost less than 20
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        // Render the "bargainbooks.ejs" template with the result
        res.render("bargainbooks.ejs", {
          shopName: "Bertie's Books ", // Add your shop name or get it from somewhere
          availableBooks: result,
        });
      }
    });
  });

  app.get("/search-result", function (req, res) {
    const searchKeyword = req.query.keyword; // Assuming the search keyword is passed as a query parameter

    // Basic Search Query
    const basicSearchQuery = "SELECT * FROM books WHERE name = ?";
    db.query(basicSearchQuery, [searchKeyword], (err, basicResult) => {
      if (err) {
        return console.error(err.message);
      }

      // Advanced Search Query
      const advancedSearchQuery = "SELECT * FROM books WHERE name LIKE ?";
      const advancedSearchKeyword = `%${searchKeyword}%`;

      db.query(
        advancedSearchQuery,
        [advancedSearchKeyword],
        (err, advancedResult) => {
          if (err) {
            return console.error(err.message);
          }

          // Combine and format the results
          const searchResults = {
            basic: basicResult,
            advanced: advancedResult,
          };

          res.render("search-result.ejs", { searchResults });
        }
      );
    });
  });
};
