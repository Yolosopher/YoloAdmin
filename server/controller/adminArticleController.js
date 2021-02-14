const formidable = require('formidable')
const ArticlesDB = require('../model/articles')
const fs = require('fs')

exports.add_article = async (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: 'Content can not be empty!' })
		return
	}
	// formidable
	const formData = new formidable.IncomingForm()

	formData.parse(req, (error, fields, files) => {
		console.log(fields)
		console.log(files)
		const size = files.fileimage.size
		const ext = files.fileimage.name.substr(
			files.fileimage.name.lastIndexOf('.')
		)
		const rawName = files.fileimage.name.replace(ext, '')

		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		let lastname = rawName + '-' + `${uniqueSuffix}${ext}`

		const newPath = 'uploads/' + lastname
		console.log(newPath)

		fs.rename(files.fileimage.path, newPath, (errorRename) => {
			console.log(errorRename)
		})

		let keywords = fields.keywords.split(' ')
		// new article
		const article = new ArticlesDB({
			title: fields.title,
			textfield: fields.textfield,
			level: fields.level,
			date: Date.now(),
			image: {
				name: lastname,
				size,
				ext,
			},
			keywords,
			status: true,
		})

		// save article in the database
		article
			.save(article)
			.then((data) => {
				res.redirect('/admin/panel/articles')
			})
			.catch((err) => {
				res.status(500).send({
					message:
						err.message ||
						'Some error occurred while creating a create operation',
				})
			})
		// remove
		// let id = fields.id
		// let updateObj
		// if (!ext) {
		// 	updateObj = {
		// 		title: fields.articleTitle,
		// 		textfield: fields.textfield,
		// 		level: fields.articleLevel,
		// 		lastUpdated: Date.now(),
		// 		keywords,
		// 		status: true,
		// 	}
		// } else {
		// 	updateObj = {
		// 		title: fields.articleTitle,
		// 		textfield: fields.textfield,
		// 		level: fields.articleLevel,
		// 		date: Date.now(),
		// 		image: {
		// 			name: lastname,
		// 			size,
		// 			ext,
		// 		},
		// 		keywords,
		// 		status: true,
		// 	}
		// }

		// ArticlesDB.findByIdAndUpdate(
		// 	id,
		// 	updateObj,
		// 	{ useFindAndModify: false }
		// ).then((data) => {
		// 	if (!data) {
		// 		res.status(404).send({
		// 			message: `Cannot Update article with ${id}. Maybe article not found!`,
		// 		})
		// 	} else {
		// 		res.redirect('/admin/articles')
		// 	}
		// })
	})
}

exports.get_articles = (req, res) => {
	// validate by ID
	if (req.query.id) {
		const id = req.query.id
		ArticlesDB.findById(id)
			.then((data) => {
				if (!data) {
					req.status(404).send({
						message: 'Not found user width id ' + id,
					})
				} else {
					res.send(data)
				}
			})
			.catch((err) => {
				res.status(500).send({
					message: 'Error retriving user with id ' + id,
				})
			})
	} else {
		// find all
		ArticlesDB.find()
			.then((data) => {
				let filteredWithActive = data.map((artc) => artc.status)
				res.send(data)
			})
			.catch((err) => {
				res.status(500).send({
					message:
						err.message ||
						'Error Occurred while retriving image information',
				})
			})
	}
}

exports.search_article = async (req, res) => {
	console.log(req.query.id)
	if (!req.query.id) {
		res.status(400).send({ message: 'Content can not be empty!' })
		return
	}
	// search
	const found = await ArticlesDB.find({ title: { $regex: req.query.id } }).catch(err => res.send(err))

	res.send(found)
}
