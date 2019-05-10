
# Intern Buddy

---

Names: Akhil Saini, Sahana Raju, Sam Jalocowiz

Date: May 10, 2019

Project Topic: Find who is interning with you from your school, find activities to do
 near your internship location, and food places to eat nearby!

URL: https://git.heroku.com/final-389k.git

---

### 1. Schemas

### 1a. Intern Schema

Data point fields:
- `Field 1`: Name                        `Type: String`
- `Field 2`: Company                     `Type: String`
- `Field 3`: Age                         `Type: Number`
- `Field 4`: Gender                      `Type: String`
- `Field 5`: Phone Number                `Type: String`
- `Field 6`: Email                       `Type: String`
- `Field 7`: Characteristics/Interests   `Type: [String]`

Schema:
```Mongo
{
  name : String,
  company : String,
  age : Number,
  gender : String,
  phone : String,
  email : String,
  characteristicsInterests: [String]
}
```
### 1b. Activity Schema

Data point fields:
- `Field 1`: Title                       `Type: String`
- `Field 2`: Description                 `Type: String`
- `Field 3`: Location                    `Type: Number`
- `Field 4`: Date                        `Type: String`

Schema:
```Mongo
{
  title : String,
  description : String,
  location : String,
  date : String,
}
```
### 1c. Food Schema

Data point fields:
- `Field 1`: Title                       `Type: String`
- `Field 2`: Rating                      `Type: Number`
- `Field 3`: Location                    `Type: String`
- `Field 4`: Reviews                     `Type: String`

Schema:
```Mongo
{
  title : String,
  rating : String,
  location : Number,
  reviews : String,
}
```

### 2. Add New Data

### 2. Add New Data: Schema 1 - Interns

HTML form route: `/addIntern'`

POST endpoint route: `/api/addIntern'`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/addIntern',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      name : 'John Smith',
      company : 'Google',
      age : 20,
      gender : 'M',
      phone : '(123)456-7899',
      email : 'john@gmail.com',
      characteristicsInterests: 'Funny,Coding,Running'
    }
};

```
### 2. Add New Data: Schema 2 - Activities

HTML form route: `/addActivity'`

POST endpoint route: `/api/addActivity`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/addActivity',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      title : 'Watch Waitress on Broadway',
      description : 'We will be going to the 2pm matinee show and will head to shake shack afterwards.',
      location : Times Square,
      date : 'May 18, 2019',
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```
### 2. Add New Data: Schema 3 - Food

HTML form route: `/addFood'`

POST endpoint route: `/api/addFood'`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/addFood',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      title : 'Rasika',
      rating : 5,
      location : 'Gallery Place',
      reviews : 'One of our favorite Indian places to eat in DC!',
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```
### 3. View Data

GET endpoint route: `/api/getInterns`

### 4. Search Data

Search Field: `company`

### 5. Navigation Pages

Navigation Filters
1. Alphabetical Companies -> `/alphabeticalCompanys`
2. Alphabetical Names -> `/alphabeticalNames`
3. Male Interns -> `/male`
4. Female Interns -> `/female`
5. Microsoft Interns -> `/microsoft`
6. Random Intern -> `/random`
7. Food -> `/food`
8. Activities -> `/activities`
9. About -> `/about`

### 6. Other API endpoints
1. Alphabetical Companies -> `/api/getAlphaComp`
2. Alphabetical Names -> `/api/getAlphaName`
3. Male Interns -> `/api/male`
4. Female Interns -> `/api/female`
5. Microsoft Interns -> `/api/getMicro`

### 7. Delete endpoints

### 7a. Delete Data: Schema 1 - Interns

HTML form route: `/removeIntern`

POST endpoint route: `/api/removeIntern'`

Example Node.js DELETE request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'DELETE',
    url: 'http://localhost:3000/api/removeIntern',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      name : 'John Smith',
    }
};
```

### 7b. Delete Data: Schema 3 - Food

HTML form route: `/removeFood'`

POST endpoint route: `/api/removeFood'`

Example Node.js DELETE request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'DELETE',
    url: 'http://localhost:3000/api/removeFood',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      title : 'Rasika'
    }
};
```
### 8. NPM Module Usage

For this portion of the project we downloaded npm node-emoji in order to incorporate emoji images into our project.

### 9. Socket Usage

If you have two users looking at the interns and one person adds an intern, then the other viewer will be able to immediately see this intern without refreshing.
