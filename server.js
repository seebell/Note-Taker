const express = require("express");
const fs = require("fs");
const util = require('util');
fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req,res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.post("/api/notes", async function (req, res) {
    console.log(`req.body`);
    console.log(req.body);

    let file = await fs.readFile("./db/db.json", "utf8")

    console.log("got the info from db.json")
    console.log(file)
    const newFile = JSON.parse(file);
    const lastId = newFile[newFile.length - 1].lastId
    req.body.id = lastId + 1 || 1
    newFile.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(newFile))
        .then(function () {
            console.log("The note has been written to db.json")

            res.json(req.body);
        })
        .catch(err => console.log(err))
});

app.get("/api/notes", async (req, res) => {
   let file = await fs.readFile("./db/db.json", "utf8")
   console.log(file)
   res.json(JSON.parse(file));
});

app.delete("/api/notes/:id", async function (req, res) {
    const { params } = req;
    let { id } = params;
    id = JSON.parse(id)
    console.log(params, id);
    let file = await fs.readFile("./db/db.json", "utf8")

    console.log('File -------------')
    console.log(file)
    var newStoreNotes = JSON.parse(file).filter((item) => item.id !== id);

    console.log(newStoreNotes)
    fs.writeFile("./db/db.json", JSON.stringify(newStoreNotes))
        .then(() => {
            res.json(newStoreNotes);
        })
    console.log("The note has been written to db.json")
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});