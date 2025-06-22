const express = require("express")
const router = express.Router()
const passport = require('passport')
const ctrlUser = require('../controller/user')
const middleware = require('../middleware')

router.get('/me', middleware.auth, ctrlUser.getCurrentUser)
router.get('/all', middleware.auth, middleware.adminAuth, ctrlUser.getAllUsers)
router.get('/:userId', ctrlUser.findById)
//router.get('/student/:userId/test', ctrlUser.getScore)
router.post('/login', ctrlUser.login)
router.post('/logout', middleware.auth, ctrlUser.logout)
router.post('/register', ctrlUser.register)
router.delete('/:userId', middleware.auth, middleware.adminAuth, ctrlUser.removeUser)


//Development routes
router.get('/all/unauthorized', ctrlUser.getAllUsers)

module.exports = router