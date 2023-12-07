# dynamic-web-forum

To get started run `bash init.sh`. That would install MySQL and create a user / default db.
This script will also populate tables and seed the database.
You might need to change the password and user in the `init.sh`, in that case don't forget to edit `mysql.createConnection` in index.js.
Then, assuming Node is installed on the server, run `npm i` followed by `node index.js`

All links are on the main page. To add a post, you must first register. After registering, go to 'Topics' and join any topic. Once you have joined a topic, you can post under that topic. To join topics, click on 'Topics,' then choose a topic you like. Once the topic details page is loaded, fill out the form to join.
