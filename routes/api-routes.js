const path = require('path');
const fs = require('fs');


const readData = () => {

    const noteData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')))
    return noteData;
}

const writeData = (noteData) => {
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(noteData), (err) => {
        if (err) return ({ err });
    })
}


module.exports = function (app) {

    app.get("/api/notes", (req, res) => {

        let noteData = readData();
        res.json(noteData)
    })

    app.post('/api/notes', (req, res) => {
        let noteData = readData();
        let newNote = req.body;
        let lastNoteID = !noteData[0] ? 0 : noteData[noteData.length - 1].id;
        let newNoteID = lastNoteID + 1

        newNote.id = newNoteID;
        noteData.push(newNote);
        writeData(noteData);
        return res.json(noteData)
    })

    app.delete('/api/notes/:id', (req, res) => {
        let noteData = readData();
        const noteId = req.params.id;
        const newNoteData = noteData.filter((note) => note.id != noteId);

        writeData(newNoteData);
        res.send(newNoteData);
    })
}