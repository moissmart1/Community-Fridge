const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Type
let typeSchema = Schema({
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
    }
});


module.exports = mongoose.model("Type", typeSchema);