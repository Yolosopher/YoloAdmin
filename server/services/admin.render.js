const axios = require('axios')

exports.login = (req, res) => {
	res.render('admin/login', {title: 'Login'})
}
exports.register = (req, res) => {
	res.render('admin/register', {title: 'Register'})
}
exports.panel = async (req, res) => {
	let cookiesUser = req.cookies.user
	console.log('cookieuser in panel')
	console.log(cookiesUser)

	const user = await axios
		.get('http://localhost:8000/admin/api/users', {
			params: { id: req.cookies.user },
		})
		.catch((err) => console.log(err))

	const settings = await axios.get('http://localhost:8000/admin/api/settings').catch(err => console.log(err))

    let title = 'Panel'
    
	res.render('admin/panel', { user: user.data, settings: settings.data, title })
}

exports.aboutus = async (req, res) => {
	let cookiesUser = req.cookies.user
	console.log('cookieuser in panel')
	console.log(cookiesUser)

	const user = await axios
		.get('http://localhost:8000/admin/api/users', {
			params: { id: req.cookies.user },
		})
		.catch((err) => console.log(err))
	
	const aboutus = await axios.get('http://localhost:8000/admin/api/aboutus').catch(err => console.log(err))

	let title = 'About Us'

	res.render('admin/aboutus', { user: user.data, aboutus: aboutus.data, title })
}