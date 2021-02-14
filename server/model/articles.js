const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
	ext: {
		type: String,
		required: true,
	},
})


const schema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	textfield: {
		type: String,
		required: true,
	},
	level: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	image: [imageSchema],
	keywords: {
		type: Array,
		required: true
	},
	status: {
		type: Boolean,
		required: true
	}
})

const ArticlesDB = mongoose.model('articles', schema)

module.exports = ArticlesDB