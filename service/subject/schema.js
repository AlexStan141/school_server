const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Subject name is required"]
    },
    fromClassYear: {
        type: String,
        required: [true, "From class year is required"]
    },
    toClassYear: {
        type: String,
        required: [true, "To class year is required"]
    }
});

const Subject = mongoose.model("subject", subjectSchema);
module.exports = Subject;