const Subject = require("./schema");

const getSubjects = () => {
    return Subject.find();
}