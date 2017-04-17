var express=require('express');

var router=express.Router();
var mongojs=require('mongojs');

var db=mongojs('mongodb://admin:root@ds117899.mlab.com:17899/mytask-list');
router

.get('/tasks',function(req,res,next){

// res.send('Task API');

db.tasks.find(function(err,tasks){

    if(err) throw err;

    res.json(tasks);

})

});

router
.get('/tasks/:id',function(req,res,next){

// res.send('Task API');

db.tasks.findOne({_id:mongojs.ObjectId(req.params.id)},function(err,tasks){

    if(err) throw err;

    res.json(tasks);

})

});


router
.post('/task',function(req,res,next){

    var task=req.body;

    if(task.title && task.isDone)
    {

        db.tasks.save(task,function(err,task){

            if(err) throw err;
            
            res.send(task); 
            console.log('saved');

        });
   
        }
         else
    {
        res.status(400);
        res.json('bad request');
    }
});


module.exports = router;