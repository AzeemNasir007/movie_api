// IMPORTS 
const express = require('express'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

// MONGOOSE from model.js
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director
	

const req = require('express/lib/request');
const res = require('express/lib/response');
const { update } = require('lodash');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');



let users = [
	{
		Username: "Kim",
		Password: "223",
		Email: "Kim@gmail.com",
		Birthday: "01/02/1988",
		FavoriteMovies: ["Scarface"]
	},
	{
		Username: "Adin",
		Password: "3344",
		Email: "Adin@gmail.com",
		Birthday: "01/04/1987",
		FavoriteMovies: ["Scarface"]
	},
	{
		Username: "Jamal",
		Password: "4432",
		Email: "Jamal@gmail.com",
		Birthday: "02/05/1988",
		FavoriteMovies: []
	},
	{
		Username: "Kelly",
		Password: "2042",
		Email: "Kelly@gmail.com",
		Birthday: "04/02/1990",
		FavoriteMovies: ["The Untouchables"]
	}
];

let movies = [
	{
		Title: "Scarface",
		Description: "It tells the story of Cuban refugee Tony Montana (Al Pacino) who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.",
		Genre: {
			Name: "Thriller",
			Description: "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
		},
		Director: {
			Name: "Brian De Palma",	
			Bio: "Brian De Palma is one of the well-known directors who spear-headed the new movement in Hollywood during the 1970s. He is known for his many films that go from violent pictures, to Hitchcock-like thrillers. Born on September 11, 1940, De Palma was born in Newark, New Jersey in an Italian-American family. Originally entering university as a physics student, De Palma became attracted to films after seeing such classics as Citizen Kane (1941).",
			Birth: 1940
		},
		ImagePath: "https://www.imdb.com/title/tt0086250/mediaviewer/rm512766208/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Top Gun: Maverick",
		Description: "After more than thirty years of service as one of the top aviators, Pete Maverick Mitchell (Tom Cruise) is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him. When he finds himself training a detachment of Top Gun graduates for a specialized mission the likes of which no living pilot has ever seen, Maverick encounters Lt. Bradley Bradshaw (Miles Teller), call sign: Rooster, the son of Mavericks late friend and Radar Intercept Officer Lt. Nick Bradshaw, aka “Goose”.",
		Genre: {
			Name: "Action",
			Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
		},
		Director: {
			Name: "Joseph Kosinski",
			Bio: "Joseph Kosinski is an American director, producer and screenwriter. Known for employing computer graphics and computer-generated imagery, Kosinski debuted with ‘Tron: Legacy,’ a visual spectacle. The movie established him as a go-to man for making movies that optimally use modern technology. Although he is an engineer by qualification, he plunged into the profession of moviemaking because of his passion fueled by his design and animation skills. He initially started making short films using technology laden with visual effects.",
			Birth: 1974
		},
		ImagePath: "https://www.imdb.com/title/tt1745960/mediaviewer/rm3294367489/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Rush Hour 2",
		Description: "The story follows Chief Inspector Lee (Chan) and LAPD Detective James Carter (Tucker), who go to Hong Kong on vacation only to be thwarted by a murder case involving two U.S. customs agents after a bombing at the American embassy. Lee suspects that the crime is linked to the Triad crime lord Ricky Tan (Lone).",
		Genre: {
			Name: "Comedy",
			Description: "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement."
		},
		Director: {
			Name: "Brett Ratner",
			Bio: "Brett Ratner (born March 28, 1969)[1] is an American film director and producer. He directed the Rush Hour film series, The Family Man, Red Dragon, X-Men: The Last Stand, and Tower Heist. He is also a producer of several films, including the Horrible Bosses series, The Revenant and War Dogs.",
			Birth: 1969
		},
		ImagePath: "https://www.imdb.com/title/tt0266915/mediaviewer/rm3051820288/?ref_=tt_ov_i",
		Featured: true
		
	},
	{
		Title: "Rush Hour 3",
		Description: "After an attempted assassination on Ambassador Han, Lee and Carter head to Paris to protect a French woman with knowledge of the Triads' secret leaders.",
		Genre: {
			Name: "Comedy",
			Description: "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.",
		},
		Director: {
			Name: "Brett Ratner",
			Bio: "Brett Ratner (born March 28, 1969)[1] is an American film director and producer. He directed the Rush Hour film series, The Family Man, Red Dragon, X-Men: The Last Stand, and Tower Heist. He is also a producer of several films, including the Horrible Bosses series, The Revenant and War Dogs.",
			Birth: 1969
		},
		ImagePath: "https://www.imdb.com/title/tt0293564/mediaviewer/rm3345322752/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Bad Boys 2",
		Description: "Two loose-cannon narcotics cops investigate the flow of Ecstasy into Florida from a Cuban drug cartel.",
		Genre: {
			Name: "Thriller",
			Description: "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
		},
		Director: {
			Name: "Michael Bay",
			Bio: "Michael Benjamin Bay (born February 17, 1965)[1] is an American film director and producer. He is best known for making big-budget, high-concept action films characterized by fast cutting, stylistic cinematography and visuals, and extensive use of special effects, including frequent depictions of explosions.",
			Birth: 1965
		},
		ImagePath: "https://www.imdb.com/title/tt0172156/mediaviewer/rm3901951744/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "The Untouchables",
		Description: "After building an empire with bootleg alcohol, legendary crime boss Al Capone (Robert De Niro) rules Chicago with an iron fist. Though Prohibition agent Eliot Ness (Kevin Costner) attempts to take Capone down, even his best efforts fail due to widespread corruption within the Windy City''s police force.",
		Genre: {
			Name: "Thriller",
			Description: "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.",
		},
		Director: {
			Name: "Brian De Palma",
			Bio: "is an American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres.",
			Birth: 1940
		},
		ImagePath: "https://www.imdb.com/title/tt0094226/mediaviewer/rm2697738496/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Step Brothers",
		Description: "Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.",
		Genre: {
			Name: "Comedy",
			Description: "Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect."
		},
		Director: {
			Name: "Judd Apatow",
			Bio: "Judd Apatow is an American producer, writer, director, actor and stand-up comedian.",
			Birth: 1967
		},
		ImagePath: "https://www.imdb.com/title/tt0838283/mediaviewer/rm3433645824/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Ford v Ferrari",
		Description: "American car designer Carroll Shelby and driver Ken Miles battle corporate interference and the laws of physics to build a revolutionary race car for Ford in order to defeat Ferrari at the 24 Hours of Le Mans in 1966.",
		Genre: {
			Name: "Action",
			Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
		},
		Director: {
			Name: "James Mangold",
			Bio: "an American film and television director, screenwriter and producer.",
			Birth: 1963
		},
		ImagePath: "https://www.imdb.com/title/tt1950186/mediaviewer/rm3937571841/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Tron: Legacy",
		Description: "A strange signal draws Sam to Flynn''s Arcade, and he is pulled into the same cyberworld in which his father, its creator, has been trapped for 20 years.",
		Genre: {
			Name: "Action",
			Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
		},
		Director: {
			Name: "Joseph Kosinksi",
			Bio: "Joseph Kosinski is an American director, producer and screenwriter. Known for employing computer graphics and computer-generated imagery, Kosinski debuted with â€˜Tron: Legacy,â€™ a visual spectacle. The movie established him as a go-to man for making movies that optimally use modern technology.",
			Birth: 1974
		},
		ImagePath: "https://www.imdb.com/title/tt1104001/mediaviewer/rm3240068608/?ref_=tt_ov_i",
		Featured: true
	},
	{
		Title: "Pineapple Express",
		Description: "The plot centers on a process server and his marijuana dealer as they are forced to flee from hitmen and a corrupt police officer after witnessing them commit a murder.",
		Genre: {
			Name: "Comedy",
			Description: "Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect."
		},
		Director: {
			Name: "Judd Apatow",
			Bio: "Judd Apatow is an American producer, writer, director, actor and stand-up comedian.",
			Birth: 1967
		},
		ImagePath: "https://www.imdb.com/title/tt0910936/mediaviewer/rm3325203968/?ref_=tt_ov_i",
		Featured: true
	}
];



//Default text response when at /
app.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
	res.send('Welcome to MyFlix!');
});

// CREATE 
// Add a user
app.post('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//allow user to update their info
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.log(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// GET all users
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// GET user by name
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err)
			res.status(500).send('Error: ' + err);
		});
});


//ADD favorite movie
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$push: { FavoriteMovies: req.params.MovieID },
		},
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});


// DELETE users favorite movie
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$pull: { FavoriteMovies: req.params.MovieID },
		},
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// DELETE user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
	.then((user) => {
		if (!user) {
			res.status(400).send(req.params.Username + 'was not found');
		} else {
			res.status(200).send(req.params.Username + 'was deleted.');
		}
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

 

// GET all movies
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
	Movies.find()
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// GET movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
	Movies.findOne({ Title: req.params.Title })
	.then((movie) => {
		res.json(movie);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send('Error ' + err);
	});
});


// GET movie by genre name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), (req, res) => {
	Movies.findOne({ 'Genre.Name' : req.params.genreName })
	.then((movie) => {
		res.json(movie.Genre);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send('Error: ' + err);
	});
});

// GET movie by director name
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false}), (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.directorName })
	.then((movie) => {
		res.json(movie.Director);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send('Error: ' + err);
	});
});

// for errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error was encountered!');
});

app.listen(8083, () => {
	console.log("your app is listening on port 8083.");
});
