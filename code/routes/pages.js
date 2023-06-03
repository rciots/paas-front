const express = require('express');
const router = express.Router();
const fs = require('fs');
router.get('/home.md', (req, res) => {
  const filePath = 'pages/home.md';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file.');
    }

    res.set('Content-Type', 'text/markdown');
    res.send(data);
  });
});
router.get('/claw.md', (req, res) => {
  const filePath = 'pages/claw.md';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file.');
    }

    res.set('Content-Type', 'text/markdown');
    res.send(data);
  });
});

module.exports = router;
