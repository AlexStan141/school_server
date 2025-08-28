const User = require('./schema')

const findByEmail = (email) => {
    return User.findOne({email})
}

const findById = (id) => {
    return User.findOne({_id: id})
}

const getAllUsers = () => {
    return User.find();
}

const removeUser = (userId) => {
    return User.findByIdAndDelete(userId);
}

module.exports = {
    findByEmail,
    findById,
    getAllUsers,
    removeUser
}