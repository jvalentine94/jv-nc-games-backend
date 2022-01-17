const db = require('../db/connection');

exports.getCategories = () => {
    return db.query(`;`,OPTIONALARG)
    .then((res)=>{
        return res
    })
}