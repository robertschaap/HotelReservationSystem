// Declarations
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const myport = 3000;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.listen(myport, function() { console.log(`Now listening on port ${myport}`); });

// Routes
app.get('/', function(req, res) {
    res.render('index');
});
