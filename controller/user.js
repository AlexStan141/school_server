const service = require('../service/user/methods')
const User = require('../service/user/schema')
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword } = require('../helpers')
require('dotenv').config()

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const valuesToValidate = [email, password]
        const fields = ["email", "password"]

        for (let i = 0; i < valuesToValidate.length; i++) {
            if (!valuesToValidate[i]) {
                let field = fields[i];

                return res.json({
                    status: "error",
                    code: 400,
                    message: `Please complete the ${field} field.`
                })
            }
        }

        const user = await service.findByEmail(email)
        if (!user || !user.validPassword(password)) {
            return res.json({
                status: "error",
                code: 400,
                message: "Incorrect login or password",
            })
        }

        if (!validateEmail(email)) {
            return res.json({
                status: "error",
                code: 400,
                message: `Please insert a valid email.`
            })
        }

        if (!validatePassword(password)) {
            return res.json({
                status: "error",
                code: 400,
                message: `A password must have at least one lowercase letter, one uppercase letter, one number and one special
                          character and must have at least 8 characters.`
            })
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        const secret = process.env.SECRET;

        const token = jwt.sign(payload, secret, { expiresIn: '1h' })
        res.json({
            status: 'success',
            code: 200,
            data: {
                token,
                user: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    _id: user._id
                }
            },
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const register = async (req, res, next) => {
    const { username, 
        email, password, 
        role, school, 
        startYear
    } = req.body;
    try {

        const valuesToValidate = [username, email, password, role, school, startYear]
        const fields = ["username", "email", "password", "role", "school", "start year"]

        for (let i = 0; i < valuesToValidate.length; i++) {
            if (!valuesToValidate[i]) {
                let field = fields[i];

                //la apelarea lui register cu dispatch din frontend soseste in payload "Request failed with status code 400"
                //asta din cauza ca am pus res.status(400). Dar noi vrem ceva mai specific, mesajul raspunsului
                /*
                return res.status(400).json({
                    status: "error",
                    code: 400,
                    message: `Please complete the ${field} field.`
                })*/

                return res.json({
                    status: "error",
                    code: 400,
                    message: `Please complete the ${field} field.`
                })
            }
        }

        if (!validateEmail(email)) {
            return res.json({
                status: "error",
                code: 400,
                message: `Please insert a valid email.`
            })
        }

        if (!validatePassword(password)) {
            return res.json({
                status: "error",
                code: 400,
                message: `A password must have at least one lowercase letter, one uppercase letter, one number and one special
                          character and must have at least 8 characters.`
            })
        }

        if(!school || school == "none"){
            return res.json({
                status: "error",
                code: 400,
                message: `Please complete the school field.`
            })
        }

        if(startYear != parseInt(startYear)){
            return res.json({
                status: "error",
                code: 400,
                message: `Please insert a valid start year.`
            })
        }

        const user = await service.findByEmail(email)
        if (user) {
            return res.json({
                status: "error",
                code: 409,
                message: "Email is already in use."
            })
        }
        const newUser = new User({ username, email, role, school, startYear})
        newUser.setPassword(password)

        const payload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            school: newUser.school,
            startYear: newUser.startYear,
        }

        const secret = process.env.SECRET;

        const token = jwt.sign(payload, secret, { expiresIn: '1h' })

        await newUser.save(
            res.status(201).json({
                status: 'success',
                code: 201,
                data: {
                    token,
                    user: {
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role,
                        school: newUser.school,
                        startYear: newUser.startYear,
                        endYear: newUser.endYear,
                        classYear: newUser.classYear,
                        subject: newUser.subject
                    }
                }
            })
        )
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const findById = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.json({
                status: "success",
                code: 200,
                data: user
            })
        } else {
            res.json({
                status: "error",
                code: 404,
                data: "User not found."
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await service.getAllUsers();
        res.json({
            status: 'success',
            code: 200,
            data: users
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const logout = async (req, res, next) => {
    req.user = null;
    res.json({
        status: "success",
        code: 200,
        data: "Logged out"
    })
}

const removeUser = async (req, res, next) => {
    const { userId } = req.params
    try {
        const user = await service.removeUser(userId);
        if (user) {
            res.json({
                status: "success",
                code: 200,
                data: user
            })
        } else {
            res.json({
                status: "error",
                code: 404,
                message: "User not found"
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getCurrentUser = async (req, res, next) => {
    const { _id, username, email, role } = req.user;
    res.json({
        status: "success",
        code: 200,
        data: { _id, username, email, role },
    })
}

module.exports = {
    login,
    logout,
    register,
    getAllUsers,
    removeUser,
    findById,
    getCurrentUser
}