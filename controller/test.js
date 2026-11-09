const service = require("../service/test/methods")
const Test = require("../service/test/schema")
const userService = require("../service/user/methods");
const User = require("../service/user/schema");

const addTest = async (req, res, next) => {

    try{
        const testData = {
            "title": req.body.title,
            "nrDisplayedQuestions": req.body.nrDisplayedQuestions,
            "questions": req.body.questions,
            "owner": req.user._id,
            "year": req.body.year,
            "promotionScore": req.body.promotionScore
        };

        const newTest = new Test(testData);

        if(req.body.nrDisplayedQuestions > req.body.questions.length){
            return res.json({
                "status": "error",
                "code": 400,
                "message": "Number of displayed questions must be smaller or equal to total number of questions."
            })
        }

        await newTest.save();
        await newTest.populate("owner", "username email");

        res.json({
            "status": "success",
            "code": 201,
            "data" : newTest
        });

    } catch(error){

        if(error.name =='ValidationError'){
            const errorsObject = error.errors;
            const errors = [
                errorsObject.title,
                errorsObject.nrDisplayedQuestions,
                errorsObject.questions,
                errorsObject.owner,
                errorsObject.year,
                errorsObject.promotionScore
            ];

            for(let error of errors){
                if(error){
                    return res.json({
                        status: "error",
                        code: 400,
                        message: error.message
                    });
                }
            }
        }
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

const getTest = async (req, res, next) => {
    try{
        const test = await service.getTest(req.params.testId);
        res.status(200).json({
            status: "success",
            code: 200,
            data: test
        })
    } catch(error){
        console.error(error)
        next(error)
    }
}

const getTeacherTests = async (req, res, next) => {

    try{

        const ownerId = req.params.userId;
        const user = await User.findById(ownerId);
        if(user.role !== "teacher"){
            return res.json({
                status: "error",
                code: 400,
                data: "Owner must be a teacher"
            })
        }


        //If the program reaches here it means that the user is a teacher and we can get his/her tests
        //If he/she has tests, we can display his/her tests, else we can display a suggestive message.
        const tests = await service.getByOwner(ownerId);
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
                message: "No tests found",
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
                data: "Test not found."
            })
        }
    } catch(error){
        console.error(error);
        next(error);
    }
}

const editTest = async (req, res, next) => {

    try{
        const { testId } = req.params;

        const testData = {
            title: req.body.title,
            nrDisplayedQuestions: req.body.nrDisplayedQuestions,
            questions: req.body.questions,
            owner: req.user._id,
            year: req.body.year, 
            promotionScore: req.body.promotionScore
        };

        if(req.body.nrDisplayedQuestions > req.body.questions.length){
            return res.json({
                "status": "error",
                "code": 400,
                "message": "Number of displayed questions must be smaller or equal to total number of questions."
            })
        }

        const updatedTest = await Test.findByIdAndUpdate(testId, testData, {
            new: true,
            runValidators: true
        });

        if(!updatedTest){
            return res.json({
                status: "error",
                code: 404,
                data: "Test not found"
            })
        }

        res.json({
            status: "success",
            code: 200,
            data: updatedTest
        })
    } catch(error){
        if(error.name =='ValidationError'){
            const errorsObject = error.errors;
            const errors = [
                errorsObject.title,
                errorsObject.nrDisplayedQuestions,
                errorsObject.questions,
                errorsObject.owner,
                errorsObject.year,
                errorsObject.promotionScore
            ];

            for(let error of errors){
                if(error){
                    return res.json({
                        status: "error",
                        code: 400,
                        message: error.message
                    });
                }
            }
        }
    }
}

module.exports = {
    addTest,
    getTests,
    removeTest,
    getTeacherTests,
    getTest,
    editTest,
}