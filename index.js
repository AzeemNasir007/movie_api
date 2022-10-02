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

let topMovies = []

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
