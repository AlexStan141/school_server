const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testSchema = new Schema({
    title: {
        type: String,
        required: [true, "Test title is required."]
    },
    questions: {
        type: [String],
        required: [true, "Questions are required."]
    },
    owner: {
        type: String,
        required: [true, "Owner is required"]
    }
})

const Test = mongoose.model("test", testSchema)

module.exports = Test