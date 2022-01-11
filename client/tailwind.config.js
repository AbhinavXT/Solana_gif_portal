const { url } = require('inspector')

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				cat: url(
					'https://thumbs.dreamstime.com/b/cat-kitten-breed-doodle-vector-seamless-pattern-isolated-wallpaper-background-black-cat-kitten-breed-doodle-vector-seamless-113587412.jpg'
				),
			},
		},
	},
	plugins: [],
}
