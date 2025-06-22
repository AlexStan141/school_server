const passport = require('passport')

const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!user || err) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Unauthorized",
                data: "Unauthorized"
            })
        }
        req.user = user;
        next()
    })(req, res, next)
}

const teacherAuth = (req, res, next) => {
    if (req.user.role !== "teacher") {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Unauthorized",
            data: "You must be a teacher for this action."
        })
    }
    next();
}

const adminAuth = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Unauthorized",
            data: "You must be an admin for this action."
        })
    }
    next();
}

module.exports = {
    auth,
    teacherAuth,
    adminAuth
}