const {getCategories} = require ('../models/games.models.js');

const {getReviewById} = require ('../models/games.models.js');

const {patchReviewById} = require('../models/games.models.js')

const {getAllReviewsModel} = require('../models/games.models.js')

const {getAllReviewCommentsModel} = require('../models/games.models.js')

const {postCommentModel} = require('../models/games.models.js')

const {deleteCommentModel} = require('../models/games.models.js')

const {getUsersModel} = require('../models/games.models.js')

const {getUsernameModel} = require('../models/games.models.js')

const {patchCommentModel} = require('../models/games.models.js')

const {checkReviewId, queryValidation} = require('../db/utils/util-funcs')

const {isCategory} = require('../db/utils/util-funcs')

const {reqParamIsNumber} = require('../db/utils/util-funcs')

const {checkCommentPostParams} = require('../db/utils/util-funcs')

exports.getCategory = (req,res) => {
    return getCategories()
    .then((items) => {
        res.status(200).send({categories: items})
    })
}

//REFACTORED, DISCUSS LIMITATION/IMPORVEMENTS WITH TUTOR
exports.getReviewId = (req,res,next) => {

    const {id} = req.params;

    return checkReviewId(id)
    .then((idExists) =>{
        
        if (idExists===true){
            getReviewById(id)
            .then((reviewData)=>{
                console.log('CONTROLER CHECKPOINT',reviewData)
                res.status(200).send({review: reviewData})
            })
            
        }

        else if (idExists===false) {
            return Promise.reject({status:404,msg:'Not Found'})
        }

        else if(idExists===undefined){
            return Promise.reject({status:400,msg:'Bad Request'})
        }
    })
    .catch((err) => {
        next(err)
    })
}

//REFACTOR THIS, DISCUSS REFACTOR WITH TUTOR
exports.patchReviewId = (req,res,next) => {

    const {id} = req.params;
    const reqQuery = req.query;
    console.log(req.query)

    // for (let keys in req.query){
    //     if (keys!=='inc_votes'){
    //         return Promise.reject({status:400,msg:'Bad Request'})
    //         .catch((err)=>{
    //             next(err)
    //         })
    //     }
    // } 

    queryValidation(reqQuery,['inc_votes'])
    .then(()=>{
        return checkReviewId(id)
    })    
    .then((idExists) =>{
        const testRE=RegExp(/^\W?[0-9]+$/)
        if (testRE.test(req.query.inc_votes)){

        if (idExists===true){
            return patchReviewById(req.params,req.query)
            .then((review)=>{

                res.status(200).send({review})
            })
        } else if (idExists===false) {
      
            return Promise.reject({status:404,msg:'Not Found'})
        } else if (idExists===undefined){
            return Promise.reject({status:400,msg:'Bad Request'})
        }
    } 
    else {
        return Promise.reject({status:400,msg:'Bad Request'})
    }


    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllReviews = (req,res,next) => {

    const {sort_by,order_by,category} = req.query;

    console.log(category)

    isCategory(category)
    .then(()=>{
        return getAllReviewsModel(sort_by,order_by,category)
    })
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })
}

exports.getAllReviewComments = (req,res,next) => {

    const {id} =req.params;
    
    reqParamIsNumber(id)
    .then(()=>{
        return getAllReviewCommentsModel(id)
    })
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req,res,next) => {

    const reviewId = req.params['id'];
    const{username,body}=req.query;
    
    queryValidation(req.query,['username','body'])
    .then(()=>{
        return postCommentModel(reviewId,username,body)
    })
    .then((comment)=>{
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req,res,next) => {

    const commentId = req.params['commentid']

    deleteCommentModel(commentId)
    .then((comment)=>{
        res.status(200).send({comment})
    })

}

exports.getUsers = (req,res) => {
    return getUsersModel()
    .then((users) => {
        res.status(200).send({users})
    })
}

exports.getUsername = (req,res) => {

    const username = req.params.username;

    return getUsernameModel(username)
    .then((user) => {
        res.status(200).send({user})
    })
}

exports.patchComment = (req,res) => {

    const votes = req.query.inc_votes;
    const commentId = req.params.comment_id;

    return patchCommentModel(commentId,votes)
    .then((comment) => {
        res.status(200).send({comment})
    })
}