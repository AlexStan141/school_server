const Test = require('./schema');

const addTest = (title, questions, owner) => {
    return Test.create({title, questions, owner});
}

const getTests = () => {
    return Test.find();
}

const getByOwner = (username) => {
    return Test.find({owner: username})
}

const getTest = (testId) => {
    return Test.findById(testId);
}

const editTest = (testId, fields) => {
    return Test.findByIdAndUpdate(testId, fields, {new: true});
}

const removeTest = (testId) => {
    return Test.findByIdAndDelete(testId);
}

module.exports = {
    addTest,
    getTests,
    removeTest,
    getByOwner,
    getTest,
    editTest
};