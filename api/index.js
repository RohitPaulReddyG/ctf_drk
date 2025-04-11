const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../artifacts.json')));

let score = 0;
let level = 0;

app.get('/', (req, res) => {
  score = 0;
  level = 0;
  res.render('index');
});

app.get('/level/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id > level) return res.redirect('/level/' + level);
  res.render('level', { level: id, data: data.levels[id] });
});

app.post('/level/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let correct = 0;
  data.levels[id].questions.forEach(q => {
    if (req.body[q.id] && req.body[q.id].trim().toLowerCase() === q.answer.toLowerCase()) {
      correct++;
    }
  });
  score += correct;
  level = id + 1;
  if (level < data.levels.length) res.redirect('/level/' + level);
  else res.redirect('/complete');
});

app.get('/complete', (req, res) => {
  let total = data.levels.reduce((acc, lvl) => acc + lvl.questions.length, 0);
  res.render('complete', { score, total });
});

app.listen(PORT, () => console.log(`CTF running on port ${PORT}`));
