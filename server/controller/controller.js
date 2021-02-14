const ArticlesDB = require('../model/articles')


exports.get_articles = (req, res) => {
	// validate by ID
	console.log(req.query.id)
	if (req.query.id) {
		const id = req.query.id
		console.log(id)
		ArticlesDB.findById(id)
			.then((data) => {
				if (!data) {
					req.status(404).send({
						message: 'Not found user width id ' + id,
					})
				} else {
					console.log(data)
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
				// console.log(data[0])
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
