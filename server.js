const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

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

  res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index'));
});

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

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
  // reading notes form db.json
  let db = JSON.parse(fs.readFileSync('db/db.json'))
  // removing note with id
  let deleteNotes = db.filter(item => item.id !== req.params.id);
  // Rewriting note to db.json
  fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
  res.json(deleteNotes);
  
})