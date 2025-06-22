const service = require("../service/test/methods")
const userService = require("../service/user/methods")

const addTest = async (req, res, next) => {
    const { title, questions } = req.body;
    const owner = req.user.username;
    try {
        const result = await service.addTest(title, questions, owner)

        res.status(201).json({
            status: "success",
            code: 201,
            data: result
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const getTests = async (req, res, next) => {
    try {
        const tests = await service.getTests()
        res.status(200).json({
            status: "success",
            code: 200,
            data: tests
        })
    } catch(error){
        console.error(error)
        next(error)
    }
}

const getTeacherTests = async (req, res, next) => {
    const { userId } = req.params;
    try{

        //Verify if the user is a teacher
        //If is not a teacher the program throws an error
        const user = await userService.findById(userId)

        if(user.role !== 'teacher'){
            res.json({
                status: "error",
                code: "400",
                data: "Please select a teacher.",
            })   
        }

        //If the program reaches here it means that the user is a teacher and we can get his/her tests
        //If he/she has tests, we can display his/her tests, else we can display a suggestive message.
        const tests = await service.getByOwner(user.username)
        if(tests.length > 0){
            res.json({
                status: "success",
                code: "200",
                data: tests
            })
        } else {
            res.json({
                status: "success",
                code: "200",
                data: [],
                message: "No tests found"
            })
        }

    } catch(error){
        console.error(error)
        next(error) 
    }
}

const removeTest = async (req, res, next) => {
    const { testId } = req.params;
    try{
        const test = await service.removeTest(testId);
        if(test){
            res.json({
                status: "success",
                code: 200,
                data: test
            })
        } else {
            res.json({
                status: "error",
                code: 404,
                data: "User not found."
            })
        }
    } catch(error){
        console.log(error);
        next(error);
    }
}

module.exports = {
    addTest,
    getTests,
    removeTest,
    getTeacherTests
}