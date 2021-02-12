const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	tel: {
		type: String,
		required: true,
	},
	linkFB: {
		type: String,
		required: true,
	},
	linkIG: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
})

const SettingsDB = mongoose.model('settings', schema)

module.exports = SettingsDB
