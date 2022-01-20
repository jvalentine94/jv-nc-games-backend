const express = require('express');

const app=express();

app.use(express.json());

const {getCategory} = require ('./controllers/controllers.js');

const {getReviewId} = require ('./controllers/controllers.js');

const {patchReviewId} = require ('./controllers/controllers.js');

const {getAllReviews} = require ('./controllers/controllers.js');

const {getAllReviewComments} = require ('./controllers/controllers.js');

const {postComment} = require ('./controllers/controllers.js');

const {deleteComment} = require ('./controllers/controllers.js');

//DATA CONTROLLERS

app.get('/api/categories', getCategory);

app.get('/api/reviews/:id', getReviewId);

app.patch('/api/reviews/:id', patchReviewId);

app.get('/api/reviews', getAllReviews)

app.get('/api/reviews/:id/comments', getAllReviewComments)

app.post('/api/reviews/:id/comments', postComment)

app.delete('/api/comments/:commentid', deleteComment)

//ERROR HANDLERS

app.use((err,req,res, next)=>{
    if(err.status){
    res.status(err.status).send({msg:err.msg})
    } else {
        next(err)
    }
})

app.use((err,req,res, next)=>{

    if(err.code == '42703'){
        res.status(400).send({msg:"Bad Request"})
    }
    if(err.code =='42601'){
        res.status(400).send({msg:"Bad Request"})
    } else{
        next(err)
    }
})

app.all((err,req,res, next)=>{
    res.status(500).send({msg:"Server Error"})
})

module.exports = app;