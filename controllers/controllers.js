const {getCategories} = require ('../models/games.models.js');

const {getReviewById} = require ('../models/games.models.js');

const {patchReviewById} = require('../models/games.models.js')

const {getAllReviewsModel} = require('../models/games.models.js')

const {checkReviewId} = require('../db/utils/util-funcs')

const {isCategory} = require('../db/utils/util-funcs')


exports.getCategory = (req,res) => {
    return getCategories()
    .then((items) => {
        res.status(200).send({categories: items})
    })
}

exports.getReviewId = (req,res,next) => {

    const {id} = req.params;

    return checkReviewId(id)
    .then((idExists) =>{
        
        if (idExists===true){
            return getReviewById(id)
            .then((review)=>{

                res.status(200).send({review: review})
            })
        } else if (idExists===false) {
      
            return Promise.reject({status:404,msg:'Not Found'})
        } else if (idExists===undefined){
            return Promise.reject({status:400,msg:'Bad Request'})
        }
    })
    .catch((err) => {
        next(err)
    })

}

//REFACTOR THIS
exports.patchReviewId = (req,res,next) => {

    const {id} = req.params;
    

    for (let keys in req.query){
        if (keys!=='inc_votes'){
            return Promise.reject({status:400,msg:'Bad Request'})
            .catch((err)=>{
                next(err)
            })
        }
    } 

    return checkReviewId(id)
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

    isCategory(category)
    .then(()=>{
        return getAllReviewsModel(sort_by,order_by,category)
    })
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err)=>{
        console.log("CONTROLLER ERROR",err)
        next(err)
    })
}