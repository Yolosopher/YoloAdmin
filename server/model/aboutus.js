const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	textarea: {
		type: String,
		required: true,
	},
})

const AboutusDB = mongoose.model('aboutus', schema)

module.exports = AboutusDB