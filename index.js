const express = require("express");
	morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
	methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
	extened: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next)=> {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

let topMovies = [
	{
		title: 'Scarface',
		author: 'Armitage Trail'
	},
	{
		title: 'Top Gun: Maverick',
		author: 'Peter Craig'
	},
	{
		title: 'Rush Hour',
		author: 'Ross LaManna, Jim Kouf'
	},
	{
		title: 'Rush Hour 2',
		author: 'Ross LaManna'
	},
	{
		title: 'Rush Hour 3',
		author: 'Ross LaManna'
	},
	{
		title: 'Bad Boys',
		author: 'George Gallo'
	},
	{
		title: 'Bad Boys 2',
		author: 'George Gallo'
	},
	{
		title: 'Bad Boys for life',
		author: 'George Gallo'
	},
	{
		title: 'The Wolf of Wall Street',
		author: 'Jordan Belfort'
	},
	{
		title: 'The Lord of the Rings: The Fellowship of the Ring',
		author: 'J. R. R. Tolkien'
	}
];

// GET request 

app.get('/', (req, res) => {
	res.send('Welcome to the movies');
});

app.get('/movies', (req, res) => {
	res.json(topMovies);
});

app.listen(8080, () => {
	console.log('your app is listening on port 8080.');
});
