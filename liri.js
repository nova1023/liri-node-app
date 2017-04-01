const fs = require("fs");
const keys = require("./keys.js");
const twitter = require("twitter");
const request = require("request");
const spotify = require("spotify");

//user's inputs
var command = process.argv[2];
var argument1 = process.argv[3];
var argument2 = process.argv[4];

//twitter variables
const consumerKey = keys.twitterKeys.consumer_key;
const consumerSecret = keys.twitterKeys.consumer_secret;
const accessKey = keys.twitterKeys.access_token_key;
const accessSecret = keys.twitterKeys.access_token_secret;


//user commands to run the app
switch (command) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyInfo(argument1);
		break;
	case "movie-this":
		movieFunction(argument1);
		break;
	case "do-what-it-says":
		randomLiri();
		break;
	default:
		console.log("nothing entered or there was a spelling error.");
		break;
};

//function to retrieve tweets
function myTweets() {
	var client = new twitter(
	{
	  consumer_key: consumerKey,
	  consumer_secret: consumerSecret,
	  access_token_key: accessKey,
	  access_token_secret: accessSecret
	});

	client.get("statuses/user_timeline", function(error, tweets, response) {
  		if(error) {
  			console.log(JSON.stringify(error, null, 2));
  			throw error;
  		}
  			
  		for (var i = 0; i < tweets.length; i++) {
  			var name = tweets[i].user.name;	
 			var text = tweets[i].text;

 			console.log("---------------------------------------------------------------");
			console.log(name);
			console.log(text);
			console.log("===============================================================");
  		}

		var commandLog = "node liri.js " + command + " " + "\n";
		fs.appendFile("./log.txt", commandLog +
			"\tUsername: " + name + "\n"
			,function(error)
			{
				if (error)
					throw error;
			});

  		for (var i = 0; i < 20; i++) {
  			text = tweets[i].text;
			fs.appendFile("./log.txt",
			"\tTweets: " + text + "\n"
			,function(error)
			{
				if(error)
					throw error;
			});
		}
	});
};

//spotify function to get song information
function spotifyInfo(argument1) {
	//if user does not input a song
	if (!argument1){
		argument1 = "The Sign Ace of Base";
	}

	//retrieving song data
	spotify.search({ type: "track", query: argument1 }, function(error, data) {
	    if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    };
	 
		console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
		console.log("Song Title: " + data.tracks.items[0].name);
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name);

		//append the command to log.txt
		var commandLog = "node liri.js " + command + " " + argument1 + "\n";
		fs.appendFile("./log.txt", commandLog, function(error)
		{
			if (error)
				throw error;
		});

		//append song data to log.txt
		fs.appendFile("./log.txt",
		"\tArtist(s): " + data.tracks.items[0].album.artists[0].name + "\n" +
		"\tSong Title: " + data.tracks.items[0].name + "\n" +
		"\tPreview Link: " + data.tracks.items[0].preview_url + "\n" +
		"\tAlbum: " + data.tracks.items[0].album.name + "\n"
		,function(error)
		{
			if (error)
				throw error;
		});
	});
};

//omdb function for movie info
function movieFunction(argument1)
{
	//if user doesn't provide a movie
	if (!argument1)
		argument1 = "Mr.Nobody";

	//retrieving movie data
	request("http://www.omdbapi.com/?t=" + argument1, function(error, response, data)
	{
		if (!error && response.statusCode === 200)
		{
			var movieData = JSON.parse(data);
			console.log("Title: " + movieData.Title);
			console.log("Release Year: " + movieData.Year);
			console.log("IMDB Rating: " + movieData.imdbRating);
			console.log("Produced in: " + movieData.Country);
			console.log("Language: " + movieData.Language);
			console.log("Plot: " + movieData.Plot);
			console.log("Actors: " + movieData.Actors);
			console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
			console.log("Rotten Tomatoes Movie Link: " +
			"https://www.rottentomatoes.com/m/" + movieData.Title);
		}

			//append the command to log.txt
			var commandLog = "node liri.js " + command + " " + argument1 + "\n";
			fs.appendFile("./log.txt", commandLog, function(error)
			{
				if (error)
					throw error;
			});

			//append the movie data to log.txt
			fs.appendFile("./log.txt", 
			"\tTitle: " + movieData.Title + "\n" +
			"\tRelease Year: " + movieData.Year + "\n" +
			"\tIMDB Rating: " + movieData.imdbRating + "\n" +
			"\tProduced in: " + movieData.Country + "\n" +
			"\tLanguage: " + movieData.Language + "\n" +
			"\tPlot: " + movieData.Plot + "\n" +
			"\tActors: " + movieData.Actors + "\n" +
			"\tRotten Tomatoes Rating: " + movieData.Ratings[1].Value + "\n" +
			"\tRotten Tomatoes Movie Link: " + "https://www.rottentomatoes.com/m/" + movieData.Title +"\n"
			,function(error)
			{
				if (error)
					throw error;
			});

	});
};

//random.txt function
function randomLiri() {
	//read from random.txt and call the command from it
	fs.readFile("./random.txt", "utf8", function(error, data)
	{
		if (error)
			throw error;
		//store command and value into global variables
		randomCommand = data.split(',')[0];
		randomArgument = data.split(',')[1];

		spotify.search({ type: "track", query: randomArgument }, function(error, data) {
			if (error) {
	        console.log('Error occurred: ' + error);
	        return;
    	};

		console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
		console.log("Song Title: " + data.tracks.items[0].name);
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name);

		});
	});
};