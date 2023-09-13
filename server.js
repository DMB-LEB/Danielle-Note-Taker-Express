const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const CLIENT_PORT = 5500;
const notesData = require('./db/db.json'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.send(notesData);
});

app.post('/api/notes', (req, res) => {
  const noteInput = req.body;
  fs.readFile('./db/db.json', function (err, data) {
    const json = JSON.parse(data);
    createNewNote(noteInput, json);
  });

  res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

function createNewNote(body, notesArray) {
  const newNote = body;
  
  notesArray.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArray)
  );
}

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);