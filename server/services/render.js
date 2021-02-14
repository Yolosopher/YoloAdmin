const axios = require('axios')
const formidable = require('formidable')
const fs = require('fs')
const nodemailer = require('nodemailer')
const ContactsDB = require('../model/contacts')

exports.home = async (req, res) => {
	const articles = await axios.get(
		'http://localhost:8000/admin/articles/api/get-articles'
	)

	const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

	let title = 'Home'

	res.render('front/index', {
		articles: articles.data,
		settings: settings.data,
		title,
	})
}
exports.news = async (req, res) => {
	if (req.query.id) {
		console.log(req.query.id)

		const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

		let title = '404 Error'
		const article = await axios
			.get('http://localhost:8000/admin/articles/api/get-articles', {
				params: { id: req.query.id },
			})
			.catch((err) => {
				console.log(err)
				res.render('front/newsin', {
					article: undefined,
					settings: settings.data,
					title,
				});
				return false;
			})

			
		const data = await article.data

		// if (article.status !== 200) {

		// }

		console.log(data)


		title = data.title

		res.render('front/newsin', {
			article: data,
			settings: settings.data,
			title,
		})
		return
	}

	let title
	if (req.body.search) {
		const found = await axios
			.get('http://localhost:8000/admin/articles/api/search-article', {
				params: { id: req.body.search },
			})
			.catch((err) => console.log(err))

		const settings = await axios
			.get('http://localhost:8000/admin/api/settings')
			.catch((err) => console.log(err))

		title = found.data[0]
			? `'${req.body.search}' - Searched!`
			: 'Error: 404!'

		res.render('front/news', {
			articles: found.data,
			settings: settings.data,
			title,
		})
		return
	}

	const articles = await axios.get(
		'http://localhost:8000/admin/articles/api/get-articles'
	)

	const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

	title = 'News'

	res.render('front/news', {
		articles: articles.data,
		settings: settings.data,
		title,
	})
}
exports.newsin = async (req, res) => {
	console.log(req.query.id)
	// const articles = await axios.get(
	// 	'http://localhost:8000/admin/articles/api/get-articles'
	// )

	const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

	title = 'News In'

	res.render('front/newsin', {
		article: undefined,
		// articles: articles.data,
		settings: settings.data,
		title,
	})
}
exports.about = async (req, res) => {
	const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

	const aboutus = await axios
		.get('http://localhost:8000/admin/api/aboutus')
		.catch((err) => console.log(err))

	let title = 'About Us'

	res.render('front/about', {
		settings: settings.data,
		aboutus: aboutus.data,
		title,
	})
}
exports.contact = async (req, res) => {
	const settings = await axios
		.get('http://localhost:8000/admin/api/settings')
		.catch((err) => console.log(err))

	let title = 'Contact'

	if (req.method === 'GET') {
		res.render('front/contact', {
			submitted: false,
			settings: settings.data,
			title,
		})
	} else {
		// IF Contact Form was sent
		if (!req.body) {
			res.status(400).send({ message: 'Content can not be empty!' })
			return
		}
		// formidable
		const formData = new formidable.IncomingForm()

		formData.parse(req, async (error, fields, files) => {
			console.log(fields)
			console.log(files)
			const size = files.fileimage.size
			const ext = files.fileimage.name.substr(
				files.fileimage.name.lastIndexOf('.')
			)
			const rawName = files.fileimage.name.replace(ext, '')

			const uniqueSuffix =
				Date.now() + '-' + Math.round(Math.random() * 1e9)
			let lastname = rawName + '-' + `${uniqueSuffix}${ext}`

			const newPath = 'uploads/' + lastname
			console.log(newPath)

			fs.rename(files.fileimage.path, newPath, (errorRename) => {
				console.log(errorRename)
			})
			let ctcSave = {
				author: fields.firstlastname,
				authorEmail: fields.email,
				subject: fields.subject,
				textfield: fields.textarea,
				level: 3,
				date: Date.now(),
				image: {
					name: lastname,
					size,
					ext,
				},
				status: false,
			}
			// new article
			const contact = new ContactsDB({
				author: fields.firstlastname,
				authorEmail: fields.email,
				subject: fields.subject,
				textfield: fields.textarea,
				level: 3,
				date: Date.now(),
				image: {
					name: lastname,
					size,
					ext,
				},
				status: false,
			})

			// save contact in the database
			let saved = await contact.save(contact).catch((err) => {
				res.status(500).send({
					message:
						err.message ||
						'Some error occurred while creating a create operation',
				})
			})

			let data = await saved
			if (!data) {
				res.send('something went wrong during sending the form')
			} else {
				const mailOutput = `
					<p>Your form on your website was successfully submitted!</p>
					<h1>Thank you</h1>
					<ul>
						<li>Author: ${ctcSave.author}</li>
						<li>Subject: ${ctcSave.subject}</li>
						<li>Date: ${ctcSave.date}</li>
					</ul>
				`

				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false, // true for 465, false for other ports
					auth: {
						user: process.env.GMAIL, // generated ethereal user
						pass: process.env.GMAIL_PASSWORD, // generated ethereal password
					},
				})

				// send mail with defined transport object
				let info = await transporter
					.sendMail({
						from: `"dogbreakdance Admin 👻" <${process.env.GMAIL}>`, // sender address
						to: ctcSave.authorEmail, // list of receivers
						subject:
							"Automatic Response after submitting dogbreakdance's contact form", // Subject line
						text: 'Hello world?', // plain text body
						html: mailOutput, // html body
					})
					.catch((err) => console.log(err))

				console.log(info)
				res.render('front/contact', {
					submitted: true,
					settings: settings.data,
					title,
				})
			}
		})
	}
}
