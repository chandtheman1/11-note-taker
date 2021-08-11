const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
// const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
};


//GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {

    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));

});

app.get('/api/notes/:id', (req, res) => {

    const { id } = req.params;
    console.log(id);
    const notes = require('./db/db.json');

    if (id) {
        const matchingNote = notes.find(note => note.id === id);
        if(matchingNote) {
            res.send(matchingNote);
        } else {
            res.json('Note ID not found')
        }
    }
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {

        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added. ID: ${newNote.id}`);
    } else {
        res.error('Error in adding note');
    }

});



app.delete('/api/notes', (req, res) => {
    console.log("delete");

    

});


//wildcard route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
