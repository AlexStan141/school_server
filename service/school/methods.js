const School = require("./schema");

const getSchools = (name) => {
    return School.find({});
}

module.exports = {
    getSchools
}