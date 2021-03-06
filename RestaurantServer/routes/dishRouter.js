const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());



//Dishes
dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) =>next(err))
    .catch((err) =>next(err));
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)  => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) =>next(err))
    .catch((err) =>next(err));
})

// DishID
dishRouter.route('/:dishId')
.options((req,res) => {res.sendStatus(200); })
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supperted on /dishes/' + req.params.dishId)
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
   Dishes.findByIdAndUpdate(req.params.dishId, 
    {$set : req.body},
    {new : true})
   .then((dish) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
},(err) =>next(err))
.catch((err) =>next(err));
   
   
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)  => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) =>next(err))
    .catch((err) =>next(err));
});


module.exports = dishRouter;