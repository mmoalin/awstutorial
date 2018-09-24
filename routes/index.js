var express = require('express');
var router = express.Router();
var api = require('../companiesHousesAPIProxy');
/* GET home page. */
router.get('/', function(req, res, next) {
  var go = new api(res, (json) => {
    this.res.send(json);
  });
  let url = "https://api.companieshouse.gov.uk/search/companies?q=AKZO+Nobel";
  go.fetchUrl(url);
  //res.render('index', { title: 'Express' });
});

module.exports = router;
