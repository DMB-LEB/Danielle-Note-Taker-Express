const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.post('/api/notes', (req, res) => {
  const noteInput = req.body;
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