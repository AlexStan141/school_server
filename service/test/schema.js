const mongoose = require("mongoose");
const User = require("../user/schema");

const Schema = mongoose.Schema;

const testSchema = new Schema({
    title: {
        type: String,
        required: [true, "Test title is required."]
    },
    nrDisplayedQuestions: {
        type: Number,
        required: [true, "Number of displayed questions is required."],
        min: [1, "You must display at least one question"],
        cast: "Number of displayed questions must be a number",
        validate: {
            validator: function(nr){
                return Number.isInteger(nr);
            },
            message: "The number of displayed questions must be a whole number"
        }
    },
    questions: {
        type: [String],
        validate: [
            {
                validator: function(arr){
                    return Array.isArray(arr) && arr.length > 0;
                },
                message: "At least one question is required"
            },
            {   
                validator: function(arr){
                    return Array.isArray(arr) && arr.indexOf("") == -1;
                },
                message: props => `Please fill question ${props.value.indexOf("") + 1}`
            }
        ]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Owner is required"]
    },
    year: {
        type: Number,
        required: [true, "Year is required"],
        min: [1, "Year must be a whole number between 1 and 8"],
        max: [8, "Year must be a whole number between 1 and 8"],
        cast: "Year must be a number",
        validate: {
            validator: function(nr){
                return Number.isInteger(nr);
            },
            message: "Year must be a whole number between 1 and 8"
        }
    },
    promotionScore: {
        type: Number,
        required: [true, "Promotion score is required"],
        min: [50, "Please insert a number between 50 and 100"],
        max: [100, "Please insert a number between 50 and 100"],
        cast: "Promotion score must be a number"
    }
})

const Test = mongoose.model("test", testSchema)

module.exports = Test