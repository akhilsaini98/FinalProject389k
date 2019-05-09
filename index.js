var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var _ = require("underscore");
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Intern = require('./models/Intern');

dotenv.config();

console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


var fs = require('fs');
var dataUtil = require("./intern-data-util");

var _DATA = dataUtil.loadData().interns;


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/',function(req,res){

  Intern.find({},function(err, interns){
    if(err) throw err
    res.render('home',{
      all : interns
    });
})

})

app.get('/microsoft',function(req,res){

  Intern.find({company: "Microsoft"}, function(err, interns){
    if(err) throw err
    
    res.render('microsoft',{
      mInterns: interns
   });
  
});

})

app.get('/male',function(req,res){

  Intern.find({gender: "M"}, function(err, interns){
    if(err) throw err
    
    res.render('male',{
      maleInterns: interns
    });
});

 
})

app.get('/female',function(req,res){

  Intern.find({gender: "F"}, function(err, interns){
    if(err) throw err
    
    res.render('female',{
      femaleInterns: interns
    });
});

})

app.get('/alphabeticalNames',function(req,res){

  Intern.find({},function(err, interns){
    if(err) throw err
    res.render('aNames',{
      alphaName: _.sortBy(interns, 'name')
    });
})
  
})

app.get('/alphabeticalCompanys',function(req,res){

  Intern.find({},function(err, interns){
    if(err) throw err

    res.render('aCompanys',{
      alphaComp: _.sortBy(interns, 'company')
    });

})

})

app.get('/random',function(req,res){

  var cNames = []

  _.each(_DATA, function(i) {
    var compName = i.company

    if (cNames.includes(compName) === false) {
      cNames.push(compName)
    }

  })
  cNames.sort()

  res.render('random',{
    names: cNames
  });
})

app.post('/getRandom',function(req,res){

  var answer = false
  var inp = fix_capitals(req.body.name)
  var all = _.where(_DATA, {
    company: inp
  });

  if (all.length > 0) {
  answer = _.sample(all);
  }
  res.render('returnRandom',{
      randomIntern : answer,
      original: inp
  });
})

app.get('/addIntern',function(req,res){
  res.render('addIntern',{});
})

app.post('/addIntern',function(req,res){

  var intern = new Intern({
   
     name: fix_capitals(req.body.name),
     company: fix_capitals(req.body.company),
     age: parseInt(req.body.age),
     gender: fix_capitals(req.body.gender),
     phone: req.body.number,
     email: req.body.email,
     characteristicsInterests: req.body.characters.split(",")

  })

  intern.save(function(err) {
    if(err) throw err
      res.render('success',{
      firstName : fix_capitals(req.body.name.split(" ")[0])
    });
})
 
})

app.post("/api/addIntern", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  var intern = new Intern({
   
    name: fix_capitals(req.body["name"]),
    company: fix_capitals(req.body["company"]),
    age: parseInt(req.body["age"]),
    gender: fix_capitals(req.body.gender),
    phone: req.body["phone"],
    email: req.body["email"],
    characteristicsInterests: req.body["characteristicsInterests"].split(",")

 })
  
 intern.save(function(err) {
  if(err) throw err
  res.send(intern)
})

});

app.get("/api/getInterns", function(req, res) {

res.send(_DATA)

});

app.get("/api/male", function(req, res) {

  var maleI = _.where(_DATA, {
    gender: "M"
  });

res.send(maleI)

});

app.get("/api/female", function(req, res) {

  var femaleI = _.where(_DATA, {
    gender: "F"
  });
res.send(femaleI)

});

app.get("/api/getAlphaName", function(req, res) {

var alphaNames = _.sortBy(_DATA, 'name')
res.send(alphaNames)

});

app.get("/api/getAlphaComp", function(req, res) {

var alphaComp = _.sortBy(_DATA, 'company')
res.send(alphaComp)

});

app.get("/api/getMicro", function(req, res) {

var micro = _.where(_DATA, {
  company: "Microsoft"
});
res.send(micro)

});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening!');
});



function fix_capitals(string)
{
  string = string.toLowerCase()
  var all = string.split(" ");
  var x = all.length
  for (var i = 0; i < x; i++) {
      all[i] = all[i][0].toUpperCase() + all[i].substr(1);
  }

  return all.join(" ");
}
