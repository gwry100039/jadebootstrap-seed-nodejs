var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // req.session.username = '0014031';
  console.log (Object.keys(req.session));
  console.log (req.session);
  res.render('index', { title: 'JADE-Bootstrap' });
});

module.exports = router;
