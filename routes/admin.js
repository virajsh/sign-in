var express = require('express');
var router = express.Router();
var md5 = require('js-md5');
var User = require('../models/userModel');
/* GET home page. */


router.get('/', function (req, res, next) {
    res.render('admin/dashboard', { 
      layout: 'layout-admin', 
      title: 'Admin Dashboard',
      navDashboard: true
    });
  });

module.exports = router;
