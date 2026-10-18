const service = require("../service/test/methods")
const userService = require("../service/user/methods")

const addTest = async (req, res, next) => {

    const owner = req.user._id;
    const { title, nrDisplayedQuestions, questions } = req.body;

    const trimmedTitle = title ? title.trim() : "";
    const trimmedNrDisplayedQuestionsAsString = nrDisplayedQuestions ? nrDisplayedQuestions.toString().trim() : "";
    const trimmedNrDisplayedQuestions = trimmedNrDisplayedQuestionsAsString ? parseInt(trimmedNrDisplayedQuestionsAsString) 
                                                                            : 0;
    const trimmedQuestions = questions.map(question => question ? question.trim() : "");

    if(trimmedTitle == ""){
        return res.json({
            status: "error",
            code: 500,
            message: "Title is required"
        });
    }

    if(trimmedNrDisplayedQuestions != trimmedNrDisplayedQuestionsAsString){
        return res.json({
            status: "error",
            code: 500,
            message: "nrDisplayedQuestions must be a number"
        });
    }


    if(trimmedNrDisplayedQuestions <= 0){
        return res.json({
            status: "error",
            code: 500,
            message: "Invalid value. Total number of displayed questions is required"
        });
    }

    if(trimmedNrDisplayedQuestions > trimmedQuestions.length){
        return res.json({
            status: "error",
            code: 500,
            message: "Total number of displayed questions must be smaller than total number of questions"
        });
    }

    if(trimmedQuestions.length == 0){
        return res.json({
            status: "error",
            code: 500,
            message: "Please insert at least one question"
        });
    }

    let idx = trimmedQuestions.findIndex(question => question == "");
    if(idx > -1){
        return res.json({
            status: "error",
            code: 500,
            message: "Please fill question " + (idx + 1)
        });
    }

    try {
        const result = await service.addTest(trimmedTitle, trimmedNrDisplayedQuestions, trimmedQuestions, owner)
        return res.status(201).json({
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
        const tests = await service.getByOwner(user._id)
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

const editTest = async (req, res, next) => {
    const { testId } = req.params;
    const {title, nrDisplayedQuestions, questions} = req.body;

    const trimmedTitle = title ? title.trim() : "";
    const trimmedNrDisplayedQuestionsAsString = nrDisplayedQuestions ? nrDisplayedQuestions.toString().trim() : "";
    const trimmedNrDisplayedQuestions = trimmedNrDisplayedQuestionsAsString ? parseInt(trimmedNrDisplayedQuestionsAsString)                                                                            : 0;
    const trimmedQuestions = questions.map(question => question ? question.trim() : "");

    if(trimmedTitle == ""){
        return res.json({
            status: "error",
            code: 500,
            message: "Title is required"
        });
    }

    if(trimmedNrDisplayedQuestions != trimmedNrDisplayedQuestionsAsString){
        return res.json({
            status: "error",
            code: 500,
            message: "nrDisplayedQuestions must be a number"
        });
    }

    if(trimmedNrDisplayedQuestions <= 0){
        return res.json({
            status: "error",
            code: 500,
            message: "Invalid value. Total number of displayed questions is required"
        });
    }

    if(trimmedQuestions){

        if(trimmedNrDisplayedQuestions > trimmedQuestions.length){
            return res.json({
                status: "error",
                code: 500,
                message: "Total number of displayed questions must be smaller than total number of questions"
            });
        }

        if(trimmedQuestions.length == 0){
            return res.json({
                status: "error",
                code: 500,
                message: "Please insert at least one question"
            });
        }

        let idx = trimmedQuestions.findIndex(question => question == "");
        if(idx > -1){
            return res.json({
                status: "error",
                code: 500,
                message: "Please fill question " + (idx + 1)
            });
        }
    }

    try{
        const obj = {}
        if(trimmedTitle) obj.title = trimmedTitle;
        if(trimmedNrDisplayedQuestions) obj.nrDisplayedQuestions = trimmedNrDisplayedQuestions;
        if(trimmedQuestions) obj.questions = trimmedQuestions;
        const result = await service.editTest(testId, obj);
        res.status(201).json({
            status: "success",
            code: 201,
            data: result
        })
    } catch(error){
        console.log(error);
        next(error);
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