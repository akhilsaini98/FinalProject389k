var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var _ = require("underscore");
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var data = require('./models/Intern');
var emoji = require('node-emoji');
//var bread = require("./bread");

dotenv.config();

console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket) {
  console.log('NEW connection.');
  socket.on('disconnect', function(){
      console.log('Oops. A user disconnected.');
});
});

app.get('/',function(req,res){

  data.Intern.find({},function(err, interns){
    if(err) throw err
    res.render('home',{
      all : interns,
      Happy: emoji.get('smile'),
      Sad: emoji.get('crying_cat_face')
    });
})

})

app.get('/about',function(req,res){
    res.render('about')
})

app.get('/activities',function(req,res){

  data.Activity.find({},function(err, activities){
    if(err) throw err
    res.render('activities',{
      all : activities,
      Position: emoji.get('woman_in_lotus_position')
    });
})

})

app.get('/food',function(req,res){

  data.Food.find({},function(err, food){
    if(err) throw err
    res.render('food',{
      all : food,
      //Bread: bread,
      Bread: emoji.get('stuffed_flatbread'),
      Soup: emoji.get('shallow_pan_of_food')
    });
})

})

app.get('/microsoft',function(req,res){

  data.Intern.find({company: "Microsoft"}, function(err, interns){
    if(err) throw err

    res.render('microsoft',{
      mInterns: interns
   });

});

})

app.get('/male',function(req,res){

  data.Intern.find({gender: "M"}, function(err, interns){
    if(err) throw err

    res.render('male',{
      maleInterns: interns,
      male: emoji.get("bearded_person")
    });
});


})

app.get('/female',function(req,res){

  data.Intern.find({gender: "F"}, function(err, interns){
    if(err) throw err

    res.render('female',{
      femaleInterns: interns,
      female: emoji.get("female-student")
    });
});

})

app.get('/alphabeticalNames',function(req,res){

  data.Intern.find({},function(err, interns){
    if(err) throw err
    res.render('aNames',{
      alphaName: _.sortBy(interns, 'name')
    });
})

})

app.get('/alphabeticalCompanys',function(req,res){

  data.Intern.find({},function(err, interns){
    if(err) throw err

    res.render('aCompanys',{
      alphaComp: _.sortBy(interns, 'company')
    });

})

})

app.get('/random',function(req,res){


  var cNames = []

  data.Intern.find({},function(err, interns){
    if(err) throw err

    _.each(interns, function(i) {
      var compName = i.company

      if (cNames.includes(compName) === false) {
        cNames.push(compName)
      }

    })

    cNames.sort()

    res.render('random',{
      names: cNames,
      red: emoji.get('question'),
      white: emoji.get('grey_question')
    });

})

})

app.post('/getRandom',function(req,res){

  var answer = false
  var inp = fix_capitals(req.body.name)

  data.Intern.find({company: inp}, function(err, interns){
    if(err) throw err

    if (interns.length > 0) {
      answer = _.sample(interns);
    }

    res.render('returnRandom',{
      randomIntern : answer,
      original: inp
  });

});

})

app.get('/addIntern',function(req,res){
  res.render('addIntern',{});
})

app.get('/removeIntern',function(req,res){
  res.render('removeIntern',{});
})

app.post('/removeIntern',function(req,res){

  data.Intern.deleteOne({name: fix_capitals(req.body.name)},function(err) {
    if(err) throw err
      res.render('deleteInternSuccess',{
      Name : fix_capitals(req.body.name),
      Sad: emoji.get('white_frowning_face')
    });
})

});


app.post('/addIntern',function(req,res){

  var intern = new data.Intern({

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
    io.emit('new intern', intern);
    res.render('success',{
    firstName : fix_capitals(req.body.name.split(" ")[0])
    });
})

})

app.get('/addActivity',function(req,res){
  res.render('addActivity',{});
})


app.post('/addActivity',function(req,res){

  var activity = new data.Activity({

     title: req.body.title,
     description: req.body.description,
     location: fix_capitals(req.body.location),
     date: req.body.date
  })


  activity.save(function(err) {
    if(err) throw err
      res.render('successActivity',{
      title : req.body.title
    });
})

})

app.get('/addFood',function(req,res){
  res.render('addFood',{});
})

app.get('/removeFood',function(req,res){
  res.render('removeFood',{});
})

app.post('/removeFood',function(req,res){

  data.Food.deleteMany({title: fix_capitals(req.body.name)},function(err) {
    if(err) throw err
      res.render('deleteFoodSuccess',{
      Name : fix_capitals(req.body.name)
    });
})

});


app.post('/addFood',function(req,res){

  var food = new data.Food({
     title: fix_capitals(req.body.title),
     rating: parseInt(req.body.rating),
     location: req.body.location,
     reviews: req.body.reviews
  })

  food.save(function(err) {
    if(err) throw err
      res.render('successFood',{
      title : req.body.title
    });
})

})

app.delete("/api/removeFood", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  data.Food.findOneAndDelete({title: fix_capitals(req.body["title"])},function(err,food) {
    if(err) throw err
    res.send(food)
    });

});

app.delete("/api/removeIntern", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  data.Intern.findOneAndDelete({name: fix_capitals(req.body["name"])},function(err,intern) {
    if(err) throw err
    res.send(intern)
    });

});

app.post("/api/addActivity", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  var activity = new data.Activity({

    title: req.body["title"],
    description: req.body["description"],
    location: req.body["location"],
    date: req.body["date"],

 })

 activity.save(function(err) {
  if(err) throw err
  res.send(activity)
})

});

app.post("/api/addFood", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  var food = new data.Food({

    title: req.body["title"],
    rating: req.body["rating"],
    location: req.body["location"],
    reviews: req.body["reviews"],

 })

 food.save(function(err) {
  if(err) throw err
  res.send(food)
})

});

app.post("/api/addIntern", function(req, res) {

  if(!req.body) { return res.send("No data recieved"); }

  var intern = new data.Intern({

    name: fix_capitals(req.body["name"]),
    company: fix_capitals(req.body["company"]),
    age: parseInt(req.body["age"]),
    gender: fix_capitals(req.body["gender"]),
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

  data.Intern.find({},function(err, interns){
    if(err) throw err
    res.send(interns)
})

});

app.get("/api/male", function(req, res) {

  data.Intern.find({gender: "M"}, function(err, interns){
    if(err) throw err

    res.send(interns)
})

});

app.get("/api/female", function(req, res) {

  data.Intern.find({gender: "F"}, function(err, interns){
    if(err) throw err
    res.send(interns)

});

});

app.get("/api/getAlphaName", function(req, res) {

  data.Intern.find({},function(err, interns){
    if(err) throw err
    res.send(_.sortBy(interns, 'name'))

})

});

app.get("/api/getAlphaComp", function(req, res) {


  data.Intern.find({},function(err, interns){
    if(err) throw err
    res.send(_.sortBy(interns, 'company'))

})

});

app.get("/api/getMicro", function(req, res) {


  data.Intern.find({company: "Microsoft"}, function(err, interns){
    if(err) throw err
    res.send(interns)
});


});

http.listen(process.env.PORT || 3000, function() {
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
