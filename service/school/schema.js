const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: {
        type: String,
        required: [true, "School name is required"]
    }
})

const School = mongoose.model("school", schoolSchema);

module.exports = School;