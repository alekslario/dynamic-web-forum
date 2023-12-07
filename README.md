# dynamic-web-forum

To get started run `bash init.sh`. That would install MySQL and create a user / default db.
This script will also populate tables and seed the database.
You might need to change the password and user in the `init.sh`, in that case don't forget to edit `mysql.createConnection` in index.js.
Then, assuming Node is installed on the server, run `npm i` followed by `node index.js`
