const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.authenticated === true ){
        console.log(req.session.user);
        res.locals.user = req.session.user;
    } else {

    }
  res.render('home');
});
router.get('/claw', (req, res) => {
  if (req.session.authenticated === true ){
      console.log(req.session.user);
      res.locals.user = req.session.user;
  } else {

  }
  res.render('claw');
});

router.get('/about', (req, res) => {
  res.render('about');
});
router.get('/documentation', (req, res) => {
  res.render('documentation');
});
module.exports = router;
