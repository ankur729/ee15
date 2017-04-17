
var express=require('express');

var router=express.Router();
var mongojs=require('mongojs');

var db=mongojs('mongodb://admin:root@ds127399.mlab.com:27399/eatoeat');

router

.get('/food-details',function(req,res,next){

// res.send('Task API');

db.food_details.find(function(err,foods){

    if(err) throw err;

    res.json(foods);

})

});

router

.post('/food-details',function(req,res,next){

// res.send('Task API');

db.food_details.save({name:"tessssssssst"},function(err,foods){

    if(err) throw err;

   console.log('food saved');

})

});

module.exports = router;