const {getCategories} = require ('../models/games.models.js');

exports.getCategory = (req,res) => {
    
    console.log(req)
    const test = req.query
    
    return getCategories(req)
    .then((res) => {
        return res
    })
}