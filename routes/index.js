const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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

app.get('/notes', (req, res) => {

    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));

});

app.post('/notes', (req, res) => {
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

app.delete('/notes/:id', (req, res) => {

    const { id } = req.params;
    const notes = require('../db/db.json');

    if (id) {
        const matchingNote = notes.find(note => note.id === id);
        if(matchingNote) {
            
            const arrayNote = notes.filter(note => {
                if (note.id !== id) {
                    return true
                } else {
                    return false
                }
            })

            writeToFile( './db/db.json', arrayNote);

            res.json(`Note deleted`);
        } else {
            res.json('Note ID not found')
        }
    }
});

module.exports = app;