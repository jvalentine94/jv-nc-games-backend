const { routes } = require('../../app')
const db = require('../../db/connection')

exports.checkReviewId = (id) => {
    return db
    .query(` SELECT * FROM reviews WHERE review_id=${id};`)
    .then(({rows})=>{
    //console.log(id,rows)
        if(rows.length>0){
            return true
        } else {
            return false
        }
    })
}

exports.isCategory = (category) => {

    //console.log(category, typeof category)

    if(category==undefined){
        return Promise.resolve()
    }

    return db
    .query(`SELECT * FROM categories WHERE slug=$1;`,[$1])
    .then((res)=>{
        console.log('UTILS',res)

        if (res.rows.length==0){
            console.log("NOT WORKING1")
            return Promise.reject({status:404,msg:'Not Found'})
        }else {
            return Promise.resolve()
        }
    })
    .catch((err)=>{
        if (err.status=404){

            console.log("NOT WORKING2",err)
            return Promise.reject({status:404,msg:'Not Found'})
        }else{
        return Promise.reject({status:400,msg:'Bad Request'})
    }
    })

}

exports.reqParamIsNumber = (reqParam) => {
    const testRE=RegExp(/^\W?[0-9]+$/)

    if (testRE.test(reqParam)){
        return Promise.resolve()
    } else {
        return Promise.reject({status:400, msg: "Bad Request"})
    }
}

exports.checkCommentPostParams = (reqParams) => {
    
    const arr = ['username','body'];

    const reqKeys = Object.keys(reqParams)
    console.log(reqKeys)

    let output=true

    for (let i=0;i<reqKeys.length;i++){
        if (!arr.includes(reqKeys[i])){
            console.log(reqParams,'ERROR INITIATED AT UTILS')
            output=false
        }
    }


    if (output==false){
        return Promise.reject({status:400, msg: "Bad Request"})
    } else {
        return Promise.resolve()
    }
}
