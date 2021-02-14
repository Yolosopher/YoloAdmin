const axios = require('axios')

exports.articles = async (req, res) => {
	let cookiesUser = req.cookies.user
	console.log('cookieuser in panel')
	console.log(cookiesUser)

	const user = await axios
		.get('http://localhost:8000/admin/api/users', {
			params: { id: req.cookies.user },
		})
		.catch((err) => console.log(err))

	const articles = await axios
		.get('http://localhost:8000/admin/articles/api/get-articles')

	let title = 'Articles'

	res.render('admin/articles', { user: user.data, articles: articles.data, title })
}
