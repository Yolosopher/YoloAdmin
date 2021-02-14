const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const path = require('path')
const jwt = require('jsonwebtoken')

// imported from elsewhere
const connectDB = require('./server/database/connection')

const app = express()

dotenv.config()

const PORT = process.env.PORT || 4000

// cookieparser
app.use(cookieParser())

// logger
app.use(morgan('tiny'))

// mongoDB connection
connectDB()

// bodyparser
app.use(bodyparser.urlencoded({extended: false}))

// view engine
app.set('view engine', 'ejs')

// load assets
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))
app.use(express.static(__dirname + '/assets/'))




// articles
app.use('/', require('./server/routes/router'))
// load routers
app.use('/admin', require('./server/routes/admin.router'))


app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`)
})
