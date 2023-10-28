const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Type = require("./typeModel");
// TODO: create the schema for an Item
let itemSchema = Schema({
    id: {
    type: String,
        required: true,
        minlength: 1,
        maxlength: 4
    },
    name: {
    type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    type: {
        type: String,
        required: [true, "You need a type"],
        validate:{
            validator: function(v) {return validators(v).then(processResult => { // process the success from the promise
                return processError.r;
                // return processResult.r;
            })
            .catch(processError => {
                return processError.r;
                // return processResult.r; // catch the error which results from the promise
            });
                    
                },
            message: 'You must provide a valid type.'
        },
    },
    img: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    }
});

function validators(v){
    return new Promise((resolve, reject) => {
        Type.findOne({id: v},function(err, result){
            if(err)throw err
            if(result){
                resolve({message: "good", r: true});
              }
              else {
                reject({message: "bad", r: false});
              }
        });
    });
}

module.exports = mongoose.model("Item", itemSchema);