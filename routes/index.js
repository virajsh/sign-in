var express = require('express');
var router = express.Router();
var md5 = require('js-md5');
var User = require('../models/userModel');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-in', function (req, res, next) {
  res.render('admin/sign-in', { layout: 'layout-signin' });
});

router.post('/sign-in', function(req,res,next){
// validate
var email = req.body.email;
var password = md5(req.body.password);

req.checkBody("email","email is required").notEmpty().withMessage("email cannot be empty").isEmail().withMessage("enter a vaild email id");
req.checkBody("password", "please enter password").notEmpty();

var errors = req.validationErrors();

if (errors) {
  var messages = [];
  errors.forEach(function(error) {
      messages.push(error.msg);
  });
  res.render('admin/sign-in', {layout:'layout-signin', error: messages.length > 0,messages: messages});
}

else{
//authenticate the details
console.log("you are here 1.......................................................................")
User.find({'email': email, 'password': password}, function(err, user){
  if (err){
    console.log("you are here 2.......................................................................")
    res.render('admin/sign-in', { 
      layout: 'layout-signin', 
      error: true, 
      messages:[err.msg]
    });
  }
  else if (user.length < 1){
    console.log("you are here 3.......................................................................")
    res.render('admin/sign-in', { 
      layout: 'layout-signin', 
      error: true, 
      messages:["Invalid userid or passsword"]
    });
  }
  else{
    console.log("you are here 5.......................................................................")
    // you found a valid user
    // set the session
    console.log(JSON.stringify(user));
    console.log(" you are finally here")
    req.session.isAuthenticated = true;
    req.session.user = user[0];
    res.locals.user = user[0];
    res.render('admin/dashboard', { 
      layout: 'layout-admin', 
      title: 'Admin Dashboard',
      navDashboard: true
    });
  }
});

}

})

router.get('/sign-up', function (req, res, next) {
  res.render('admin/sign-up', { layout: 'layout-signin' });
});

router.post('/sign-up', function (req, res, next) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = md5(req.body.password);
  user.createAt = new Date();
  user.save(function (err, user) {
    console.log(JSON.stringify(user));

    if (err) res.send(err);
    res.redirect('/sign-in');
  });
});
  

module.exports = router;
