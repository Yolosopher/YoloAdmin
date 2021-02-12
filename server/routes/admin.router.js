const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

// renders
const services = require('../services/admin.render')

// controller
const controller = require('../controller/adminController')

// router.use(controller.jwtCheck)

router.use('/panel', (req, res, next) => {
    if (!req.cookies.jwt) {
        res.redirect('/admin/login')
	} else if (!req.cookies.user) {
        let decoded = jwt.verify(req.cookies.jwt, 'secret')
        res.cookie('user', decoded.id, { path: '/admin' });
        res.redirect('/admin/panel')
        next()
	}
    next()
})
router.use('/login', (req, res, next) => {
    if (req.cookies.jwt && req.cookies.user) {
        res.redirect('/admin/panel')
        return
    }
    next()
})
router.get('/', (req, res) => res.redirect('/admin/login'))
router.get('/login', services.login)
router.post('/login', controller.loginUser)
router.get('/register', services.register)
router.post('/register', controller.createUser)
router.get('/panel', services.panel)

// api
router.get('/api/settings', controller.update_settings)
router.post('/api/settings', controller.update_settings)
router.get('/api/users/', controller.findone)
router.get('/api/users/logout', controller.logout)

module.exports = router
