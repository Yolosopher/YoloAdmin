const UsersDB = require('../model/users')
const SettingsDB = require('../model/settings')
const jwt = require('jsonwebtoken')

exports.createUser = (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: 'Content can not be empty!' })
	}

	// new user
	const user = new UsersDB({
		email: req.body.email,
		password: req.body.password,
	})

	// save user in the db
	user.save(user)
		.then(() => {
			res.redirect('/admin/login')
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					'Some error occurred while executing a create operation',
			})
		})
}

exports.loginUser = (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: 'Content can not be empty!' })
		return
	}

	// validate user
	UsersDB.findOne({
		email: req.body.email,
		password: req.body.password,
	}).then((data) => {
		if (!data) {
			res.status(404).redirect('/admin/login')
		} else {
			let token = jwt.sign({ id: data._id }, 'secret', {
				expiresIn: '1h',
			})
			res.cookie('jwt', token, { path: '/admin' })
			res.redirect(`/admin/panel`)
		}
	})
}

exports.findone = (req, res) => {
	if (!req.query.id) {
		res.send('req.query.id wasnt given')
		return
	} else {
		let id = req.query.id
		console.log(id)
		UsersDB.findById(id)
			.then((data) => {
				if (!data) {
					res.status(404).send({
						message: 'Not found user with id ' + id,
					})
				} else {
					res.send(data)
				}
			})
			.catch((err) => {
				res.status(500).send({
					message: err,
				})
			})
	}
}


exports.logout = (req, res) => {
	res.clearCookie('jwt', {path: '/admin'})
	res.clearCookie('user', {path: '/admin'})
	res.redirect('/admin/login')
}

exports.settings = (req, res) => {
	// SettingsDB.find()
	res.send('settings')
}

exports.update_settings = async (req, res) => {
	if (req.method === 'POST') {
		if (!req.body) {
			res.status(400).send({ message: 'Content can not be empty!' })
			return
		}
		// update
		let prevSets = await SettingsDB.find().catch((err) => console.log(err))

		let id = prevSets[0]._id

		let updated = await SettingsDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).catch(err => console.log(err))

		if (!updated) {
			res.status(404).send({
				message: `Cannot Update user with ${id}. Maybe user not found!`,
			})
		} else {
			res.redirect('/admin/panel')
		}
	} else {
		let setts = await SettingsDB.find().catch((err) => console.log(err))
		res.send(setts[0])
	}
}