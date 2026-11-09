const express = require("express")
const router = express.Router()
const ctrlTest = require('../controller/test')
const middleware = require('../middleware')

router.post("/", middleware.auth, middleware.teacherAuth, ctrlTest.addTest);
router.get("/", ctrlTest.getTests);
router.get("/owner/:userId", middleware.auth, middleware.teacherAuth, ctrlTest.getTeacherTests);
router.get("/test/:testId", ctrlTest.getTest);
router.put("/:testId", middleware.auth, middleware.teacherAuth, ctrlTest.editTest);
router.delete("/:testId", ctrlTest.removeTest);

module.exports = router