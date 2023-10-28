const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require('path');
let Type = require("./typeModel");
let Item = require("./itemModel");
const { validate } = require("./typeModel");
const res = require("express/lib/response");
var types = [];
// TODO: complete the scheme for a Fridge
let fridgeSchema = Schema({
	id: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 6
	},
    name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	numItemsAccepted: {
		type: Number,
        default: 0
	},
	canAcceptItems: {
		type: Number,
		required: [true, "Please input a minimum value of 1"],
        min: [1, "You can't have negative Items."],
		max: [100, "We don't have room for that many Items."],
	},
	contactInfo: {
        contactPerson: {
            type: String,
            required: true,
        },                
        contactPhone: {
            type: String,
            required: true,
        }
	},
    address: {
        street: {
            type: String,
        },                
        postalCode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },                
        province: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
	},
    acceptedTypes: [{ 
        type:String, 
        required: true,
        validate: {
            validator: function(v) {types.push(v); return validators(v).then(processResult => { // process the success from the promise
                return processError.r;
                // return processResult.r;
              })
              .catch(processError => {
                return processError.r;
                // return processResult.r; // catch the error which results from the promise
              });
                    
                },
            message: 'You must provide a valid type.'
    }}],
    items: [{
                id: {
                    type: String,
                    require: true,
                    ref: 'item',
                    validate: {
                        validator: function(v) {return validatorsItem(v).then(processResult => { // process the success from the promise
                            return processError.r;
                            // return processResult.r;
                          })
                          .catch(processError => {
                            return processError.r;
                            // return processResult.r; // catch the error which results from the promise
                          });
                                
                            },
                        message: 'You must provide a valid Item that correspond to the types accepted in the fridge.'
                },
                },
                quantity: {
                    type: Number,
                    require: true
                }
            }]
});


fridgeSchema.methods.findItem = function(id,type){
    for(let item of this.items){
        if(type == 1){
            id.includes(item.id)
            return true;
        }
        else if(id == item.id)
            return true;
    }
    return false;
}
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

function validatorsItem(v){
    return new Promise((resolve, reject) => {
        Item.findOne({id: v},function(err, result){
            if(err)throw err
            if(result && types.includes(result.type)){
                resolve({message: "good", r: true});
              }
              else {
                reject({message: "bad", r: false});
              }
        });
    });
}

module.exports = mongoose.model("Fridge", fridgeSchema);
