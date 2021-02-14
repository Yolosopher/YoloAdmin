const express = require('express')

const router = express.Router()

// renders
const services = require('../services/render')

// controller
const controller = require('../controller/controller')

router.get('/', services.home)
router.get('/news', services.news)
router.get('/news/:id', services.news)
router.post('/news', services.news)
router.get('/about', services.about)
router.get('/contact', services.contact)


// API
router.post('/contact', services.contact)
router.get('/get-article-by-id', services.contact)


module.exports = router