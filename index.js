const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	uuid = require('uuid');
	morgan = require('morgan');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// app.use((err, req, res, next)=> {
// 	console.error(err.stack);
// 	res.status(500).send('Something broke!');
// });

let users = [
	{
		id: 1,
		name: "Tony",
		favoriteMovies: []
	},
	{
		id: 2,
		name: "Kim",
		favoriteMovies: ["Scarface"]
	}
];

let movies = [
	{
		"Title": "Scarface",
		"Description": "It tells the story of Cuban refugee Tony Montana (Al Pacino) who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.",
		"Genre": {
			"Name": "Thriller",
			"Description": "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
		},
		"Director": {
			"Name": "Brian De Palma",	
			"Bio": "Brian De Palma is one of the well-known directors who spear-headed the new movement in Hollywood during the 1970s. He is known for his many films that go from violent pictures, to Hitchcock-like thrillers. Born on September 11, 1940, De Palma was born in Newark, New Jersey in an Italian-American family. Originally entering university as a physics student, De Palma became attracted to films after seeing such classics as Citizen Kane (1941).",
			"Birth": 1940
		}
	},
	{
		"Title": "Top Gun: Maverick",
		"Description": "After more than thirty years of service as one of the top aviators, Pete Maverick Mitchell (Tom Cruise) is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him. When he finds himself training a detachment of Top Gun graduates for a specialized mission the likes of which no living pilot has ever seen, Maverick encounters Lt. Bradley Bradshaw (Miles Teller), call sign: Rooster, the son of Mavericks late friend and Radar Intercept Officer Lt. Nick Bradshaw, aka “Goose”.",
		"Genre": {
			"Name": "Action",
			"Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
		},
		"Director": {
			"Name": "Joseph Kosinski",
			"Bio": "Joseph Kosinski is an American director, producer and screenwriter. Known for employing computer graphics and computer-generated imagery, Kosinski debuted with ‘Tron: Legacy,’ a visual spectacle. The movie established him as a go-to man for making movies that optimally use modern technology. Although he is an engineer by qualification, he plunged into the profession of moviemaking because of his passion fueled by his design and animation skills. He initially started making short films using technology laden with visual effects.",
			"Birth": 1974
		}
	},
	{
		"Title": "Rush Hour 2",
		"Description": "The story follows Chief Inspector Lee (Chan) and LAPD Detective James Carter (Tucker), who go to Hong Kong on vacation only to be thwarted by a murder case involving two U.S. customs agents after a bombing at the American embassy. Lee suspects that the crime is linked to the Triad crime lord Ricky Tan (Lone).",
		"Genre": {
			"Name": "Comedy",
			"Description": "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement."
		},
		"Director": {
			"Name": "Brett Ratner",
			"Bio": "Brett Ratner (born March 28, 1969)[1] is an American film director and producer. He directed the Rush Hour film series, The Family Man, Red Dragon, X-Men: The Last Stand, and Tower Heist. He is also a producer of several films, including the Horrible Bosses series, The Revenant and War Dogs.",
			"Birth": 1969
		}
	},
	{
		"Title": "Rush Hour 3",
		"Description": "After an attempted assassination on Ambassador Han, Lee and Carter head to Paris to protect a French woman with knowledge of the Triads' secret leaders.",
		"Genre": {
			"Name": "Comedy",
			"Description": "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.",
		},
		"Director": {
			"Name": "Brett Ratner",
			"Bio": "Brett Ratner (born March 28, 1969)[1] is an American film director and producer. He directed the Rush Hour film series, The Family Man, Red Dragon, X-Men: The Last Stand, and Tower Heist. He is also a producer of several films, including the Horrible Bosses series, The Revenant and War Dogs.",
			"Birth": 1969
		}
	},
	{
		"Title": "Bad Boys 2",
		"Description": "Two loose-cannon narcotics cops investigate the flow of Ecstasy into Florida from a Cuban drug cartel.",
		"Genre": {
			"Name": "Thriller",
			"Description": "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
		},
		"Director": {
			"Name": "Michael Bay",
			"Bio": "Michael Benjamin Bay (born February 17, 1965)[1] is an American film director and producer. He is best known for making big-budget, high-concept action films characterized by fast cutting, stylistic cinematography and visuals, and extensive use of special effects, including frequent depictions of explosions.",
			"Birth": 1965
		}
	}
];

// CREATE 
app.post('/users', (req, res) => {
	const newUser = req.body;

	if(newUser.name) {
		newUser.id = uuid.v4();
		users.push(newUser);
		res.status(201).json(newUser)
	} else {
		res.status(400).send('users need name')
	}
})

// UPDATE
app.put('/users/:id', (req, res) => {
	const { id } = req.params;
	const updatedUser = req.body;

	let user = users.find(user => user.id == id);

	if (user) {
		user.name = updatedUser.name;
		res.status(200).json(user);
	} else {
		res.status(400).send('no such user')
	}
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
	const { id, movieTitle } = req.params;

	let user = users.find( user => user.id == id);

	if(user) {
		user.favoriteMovies.push(movieTitle);
		res.status(200).send(`${movieTitle} had been added to user ${id}'s array`);
	} else {
		res.status(400).send('no such user')
	}
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
	const { id, movieTitle } = req.params;

	let user = users.find( user => user.id == id);

	if(user) {
		user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
		res.status(200).send(`${movieTitle} had been removed user ${id}'s array`);
	} else {
		res.status(400).send('no such user')
	}
})

// DELETE
app.delete('/users/:id', (req, res) => {
	const { id } = req.params;

	let user = users.find( user => user.id == id);

	if(user) {
		users = users.filter( user => user.id != id);
		res.status(200).send(`user ${id} has been deleted`);
	} else {
		res.status(400).send('no such user')
	}
})
 
 
// READ
app.get('/movies', (req, res) => {
	res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) => {
	const {title} = req.params;
	const movie = movies.find( movie => movie.Title === title );

	if (movie) {
		res.status(200).json(movie);
	} else {
		res.status(400).send('no such movie')
	}
})

// READ
app.get('/movies/genre/:genreName', (req, res) => {
	const { genreName } = req.params;
	const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

	if (genre) {
		res.status(200).json(genre);
	} else {
		res.status(400).send('no such genre')
	}
})

// READ
app.get('/movies/director/:directorName', (req, res) => {
	const { directorName } = req.params;
	const director = movies.find( movie => movie.Director.Name === directorName ).Director;

	if (director) {
		res.status(200).json(director);
	} else {
		res.status(400).send('no such director')
	}
})

app.listen(8083, () => {
	console.log("your app is listening on port 8083.");
});
