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
	author: {
		type: String,
		required: true,
	},
    authorEmail: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
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
	status: {
		type: Boolean,
		required: true
	}
})

const ContactsDB = mongoose.model('contacts', schema)

module.exports = ContactsDB