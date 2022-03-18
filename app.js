const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    title: 'What is your favorite programming language?',
    description: 'Choose one option.',
    options: ['Ruby', 'PHP', 'Java', 'Rust'],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
