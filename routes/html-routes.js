const path = require('path');

module.exports = function (app) {

    app.get("/notes", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // If no matching route is found default to home
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

}