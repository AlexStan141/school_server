const express = require("express")
const router = express.Router()
const ctrlSchool = require('../controller/school')
const middleware = require('../middleware')

router.get("/", ctrlSchool.getSchools);

module.exports = router