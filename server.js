var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var port = process.env.PORT || 8080;

// viewed at http://localhost:port
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/ShootExample.html'));
});

const dbURI = 'mongodb+srv://admin:admin@cluster0.mfpj7.mongodb.net/database';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
      console.log("baglandi");
  }).catch((err) => console.log(err));


  
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    },
    score: {
    type: Number,
    required: [true, 'Please enter a password'],
    }
});

const User = mongoose.model('user', userSchema);

app.post('/update', function(req, res) {
    var name = req.body.name;
    var score = req.body.highscore;

    console.log(name, score);


    try {
        const user = User.create({ name, score });
        res.status(201).json(user);
      }
      catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
      }


});

app.get('/update', function(req, res) {


    User.find({// Search Filters
    },
    ['name','score'], // Columns to Return
    {
        skip:0, // Starting Row
        limit:10, // Ending Row
        sort:{
            score: -1 //Sort by Date Added DESC
        }
    },
    function(err,allNews){
        // Do something with the array of 10 objects
        res.send(allNews);
    })
});

app.listen(port);