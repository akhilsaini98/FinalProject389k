var mongoose = require('mongoose');

var internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    age: {
      type: Number,
      min: 0,
      max: 1000,
      required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    characteristicsInterests: [String]
});

var activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

var foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reviews: String
});

var Intern = mongoose.model('Intern', internSchema);
var Activity = mongoose.model('Activity', activitySchema);
var Food = mongoose.model('Food', foodSchema);


//module.exports = Intern;

module.exports = {
    Intern: Intern,
    Activity: Activity,
    Food: Food
}
