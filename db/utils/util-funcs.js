const { routes } = require('../../app')
const db = require('../../db/connection')

exports.checkReviewId = (id) => {
    return db
    .query(` SELECT * FROM reviews WHERE review_id=${id};`)
    .then(({rows})=>{
    console.log(id,rows)
        if(rows.length>0){
            return true
        } else {
            return false
        }
    })
}

exports.checkReviewId = (id) => {
    return db
    .query(`QUERY;`)
    .then((res)=>{
 
    })
}


