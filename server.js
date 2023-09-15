const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Gets existing notes from the api
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

// Sending new notes to the api 
app.post('/api/notes', (req, res) => {
  const noteInput = {
    title: req.body.title,
    text: req.body.text,
    // creating unique id for each note
    id: uniqid(),
  };
  fs.readFile('db/db.json', function (err, data) {
    const json = JSON.parse(data);
    createNewNote(noteInput, json);
  });

// Sends note data to website
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

// Getting index.html directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index'));
});

// Getting notes.html directory
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes'));
});

//Pushes new notes into existing array in db/db.json
function createNewNote(body, notesArray) {
  const newNote = body;
  
  notesArray.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, 'db/db.json'),
      JSON.stringify(notesArray)
  );
  }

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

// Deletes note based off id parameter
app.delete('/api/notes/:id', (req, res) => {
  // Reads notes from db.json
  let db = JSON.parse(fs.readFileSync('db/db.json'))
  // Removes note with id
  let deleteNotes = db.filter(item => item.id !== req.params.id);
  // Rewrites note into db/db.json
  fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
  res.json(deleteNotes);
  
});