const express = require('express');
const path = require('path');
const api = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));
app.use('/api', api); //   /api routes


// GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});


// wildcard route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
