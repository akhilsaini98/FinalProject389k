var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var _ = require("underscore");


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

  res.render('home',{
    all : _DATA
  });
})

app.get('/microsoft',function(req,res){

    var mIntern = _.where(_DATA, {
      company: "Microsoft"
    });

  res.render('microsoft',{
     mInterns: mIntern
  });
})

app.get('/male',function(req,res){

  var maleI = _.where(_DATA, {
    gender: "M"
  });

  res.render('male',{
    maleInterns: maleI
  });
})

app.get('/female',function(req,res){

  var femaleI = _.where(_DATA, {
    gender: "F"
  });

  res.render('female',{
    femaleInterns: femaleI
  });
})

app.get('/alphabeticalNames',function(req,res){

  var alphaNames = _.sortBy(_DATA, 'name')

  res.render('aNames',{
    alphaName: alphaNames
  });
})

app.get('/alphabeticalCompanys',function(req,res){

var alphaC = _.sortBy(_DATA, 'company')

  res.render('aCompanys',{
    alphaComp: alphaC
  });
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

  var answer = {
    "name": fix_capitals(req.body.name),
    "company": fix_capitals(req.body.company),
    "age": parseInt(req.body.age),
    "gender": fix_capitals(req.body.gender),
    "phone": req.body.number,
    "email": req.body.email,
    "characteristicsInterests": req.body.characters.split(",")
  };

  _DATA.push(answer)
  dataUtil.saveData(_DATA)
  res.render('success',{
    firstName : fix_capitals(req.body.name.split(" ")[0])
  });
})

app.post("/api/addIntern", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

    var
  answer = {
    "name": fix_capitals(req.body["name"]),
    "company": fix_capitals(req.body["company"]),
    "age": parseInt(req.body["age"]),
    "gender": fix_capitals(req.body.gender),
    "phone": req.body["phone"],
    "email": req.body["email"],
    "characteristicsInterests": req.body["characteristicsInterests"].split(",")
  };

  _DATA.push(answer)
  dataUtil.saveData(_DATA)
  res.send(answer)

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
