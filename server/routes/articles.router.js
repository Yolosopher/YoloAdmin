const express = require('express')

const router = express.Router()

// renders
const services = require('../services/adminArticle.render')

// controller
const controller = require('../controller/adminArticleController')

router.get('/', services.articles)






module.exports = router