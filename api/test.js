const express = require("express")
const router = express.Router()
const ctrlTest = require('../controller/test')
const middleware = require('../middleware')

router.post("/", middleware.auth, middleware.teacherAuth, ctrlTest.addTest);
router.get("/", ctrlTest.getTests);
router.get("/:userId", ctrlTest.getTeacherTests)
router.delete("/:testId", ctrlTest.removeTest);

module.exports = router