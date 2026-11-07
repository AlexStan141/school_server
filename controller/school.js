const schoolService = require("../service/school/methods");

const getSchools = async (req, res, next) => {
    try{
        const school = await schoolService.getSchools();
        return res.json({
            status: "success",
            code: 200,
            data: school
        })
    } catch(error){
        console.log(error);
        next(error);
    }
}

module.exports = {
    getSchools
}