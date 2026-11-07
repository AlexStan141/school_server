const service = require("../service/test/methods")
const userService = require("../service/user/methods")

const addTest = async (req, res, next) => {

    const owner = req.user._id;
    const { title, nrDisplayedQuestions, questions, year, promotionScore} = req.body;

    const trimmedTitle = title.trim();
    const trimmedQuestions = questions.map(question => question.trim());

    if(!trimmedTitle){
        return res.json({
            status: "error",
            code: 400,
            message: "Title is required"
        });
    }

    if(!nrDisplayedQuestions){
        return res.json({
            status: "error",
            code: 400,
            message: "Number of displayed questions is required"
        });
    }

    if(nrDisplayedQuestions != parseInt(nrDisplayedQuestions)){
        return res.json({
            status: "error",
            code: 400,
            message: "Number of displayed questions must be an integer"
        });
    }

    if(nrDisplayedQuestions <= 0){
        return res.json({
            status: "error",
            code: 500,
            message: "Number of displayed questions must be greater or equal to 1."
        });
    }

    if(!year){
        return res.json({
            status: "error",
            code: 400,
            message: "Year is required"
        });
    }

    if(year != parseInt(year)){
        return res.json({
            status: "error",
            code: 400,
            message: "Year must be an integer"
        });
    }

    if(year < 1 || year > 8){
        return res.json({
            status: "error",
            code: 400,
            message: "Year must be between 1 and 8"
        });
    }

    if(!promotionScore){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score is required"
        });
    }

    if(promotionScore != parseFloat(promotionScore)){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score must be a number"
        });
    }

    if(promotionScore < 50 || promotionScore > 80){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score must be between 50 and 80"
        });
    }

    if(nrDisplayedQuestions > trimmedQuestions.length){
        return res.json({
            status: "error",
            code: 500,
            message: "Total number of displayed questions must be smaller than or equal to total number of questions"
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
        const result = await service.addTest(trimmedTitle, nrDisplayedQuestions, trimmedQuestions, owner, year, promotionScore)
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

    const owner = req.user._id;
    const testToEdit = await service.getTest(testId);

    if(!testToEdit){
        return res.json({
            status: "error",
            code: 404,
            data: "Test not found"
        })
    }

    if(testToEdit.owner.toString() !== owner.toString()){
        return res.json({
            status: "error",
            code: 403,
            data: "You are not the owner of the test"
        })
    }

    const {title, nrDisplayedQuestions, questions, year, promotionScore} = req.body;

    if(title == ""){
        return res.json({
            status: "error",
            code: 400,
            message: "Title is required"
        })
    }

    if(nrDisplayedQuestions == ""){
        return res.json({
            status: "error",
            code: 400,
            message: "Number of displayed questions is required"
        })
    }

    if(year == ""){
        return res.json({
            status: "error",
            code: 400,
            message: "Year is required"
        })
    }

    if(promotionScore == ""){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score is required"
        })
    }

    if(nrDisplayedQuestions != parseInt(nrDisplayedQuestions)){
        return res.json({
            status: "error",
            code: 400,
            message: "Number of displayed questions must be an integer"
        });
    }

    if(nrDisplayedQuestions <= 0){
        return res.json({
            status: "error",
            code: 400,
            message: "Number of displayed questions must be greater or equal to 1."
        });
    }

    if(questions){

        if(questions.length == 0){
            return res.json({
                status: "error",
                code: 400,
                message: "The test must have a least one question."
            });
        }

        const trimmedQuestions = questions.map(question => question.trim());

        if(nrDisplayedQuestions && nrDisplayedQuestions > questions.length){
            return res.json({
                status: "error",
                code: 400,
                message: "Total number of displayed questions must be smaller than or equal to total number of questions"
            });
        }

        let idx = trimmedQuestions.findIndex(question => question == "");
        if(idx > -1){
            return res.json({
                status: "error",
                code: 400,
                message: "Please fill question " + (idx + 1)
            });
        }

    }  
        
    if(year != parseInt(year)){
        return res.json({
            status: "error",
            code: 400,
            message: "Year must be an integer"
        })
    }

    if(year < 1 || year > 8){
        return res.json({
            status: "error",
            code: 400,
            message: "Year must be between 1 and 8"
        })
    }

    if(promotionScore != parseFloat(promotionScore)){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score must be a number"
        })
    }
    if(promotionScore < 50 || promotionScore > 100){
        return res.json({
            status: "error",
            code: 400,
            message: "Promotion score must be between 50 and 100"
        })
    }


    try{
        const obj = {}
        obj.title = title.trim();
        obj.nrDisplayedQuestions = nrDisplayedQuestions;
        obj.questions = questions.map(question => question.trim());
        obj.year = year;
        obj.promotionScore = promotionScore;
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