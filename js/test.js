//grab the necessary elements from the page 
var form = document.getElementById("form1"),
	text = document.getElementById("text1"),
	btn = document.getElementById("button1"),
	container = document.getElementById("content"),
	anchors = document.getElementsByClassName("thumbs");

//jquery function to return values from an ajax request.
jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            success: function(data) {
                result = data;
            }
        });
        
       return result;
    }
});

//function to safely add components to URL query.
function addURLParam(url, name, value) {
	url += (url.indexOf("?") == -1 ? "?" : "&");
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
}

//this function is responsible for displaying the biography and top movie information when an actor image is clicked on from the main page.
//essentially what happens is that various data about the actor and top movie are stored in html element attributes (bad practice) and
//then the current contents of the page are cleared out, new elements are created and appended to the page which contain the new relevant information 
//(i.e. the actor image, actor name, actor biography, top movie image and top movie synopsis).
function presentBio() {
	//clear current contents of the main page
	container.innerHTML = "";
	//create a new div to hold all of the actor/top movie information
	var aDiv = document.createElement("div");
	//apply bootstrap class names to conform to grid with media breakpoints
	aDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	//make a new img element for the actor profile image
	var actorPic = document.createElement("img");
	//give the img responsive class names
	actorPic.className = "featurette-image img-responsive";
	//grab the img src for the actor profile image from the image that was originally clicked on
	actorPic.src = $(this).attr("src");
	//set the data-src attribute per bootstrap placeholder
	actorPic.dataSrc="holder.js/500x500/auto";
	//append the profile image to the div
	aDiv.appendChild(actorPic);
	//append the div to the now empty container
	container.appendChild(aDiv);
	//create another div to hold the bio
	var bDiv = document.createElement("div");
	//apply bootstrap classes to conform to grid
	bDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	//create a header element for the actor name
	var actorHeader = document.createElement("h1");
	//grab the name from the element that was clicked on and set it to the inner html of the actor header
	actorHeader.innerHTML = $(this).attr("alt");
	//create a text element for actor bio
	var actorText = document.createElement("p");
	//grab the bio information from the element that was clicked on and set as inner html of actor text
	actorText.innerHTML = $(this).attr("name");
	//append things to other things
	bDiv.appendChild(actorHeader);
	bDiv.appendChild(actorText);
	//append things to container
	container.appendChild(bDiv);
	//create a div for the top movie info
	var row = document.createElement("div");
	//give the div a bootstrap class name to serve as a row between both section (actor and topmovie)
	row.className = "row featurette";
	//append row to container
	container.appendChild(row);
	//create new div for top movie image with proper bootstrap classnames for the grid
	var cDiv = document.createElement("div");
	cDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	//create an image element for the top movie and set responsive bootstrap classes
	var filmPic = document.createElement("img");
	filmPic.className = "featurette-image img-responsive";
	//grab img src from attribute on the element that was clicked
	//in this case that would be the width. this is a bad practice. don't do this.
	filmPic.src = $(this).attr("width");
	filmPic.dataSrc="holder.js/500x500/auto";
	//append top movie image to div and append div to container
	cDiv.appendChild(filmPic);
	container.appendChild(cDiv);
	//create final div for top movie synopsis with bootstrap grid classnames
	var dDiv = document.createElement("div");
	dDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	//create new header to store a funny title about the synopsis into
	var filmHeader = document.createElement("h1");
	var filmHeaderText = document.createTextNode("The people have spoken: ");
	//append header to top movie synopsis div
	filmHeader.appendChild(filmHeaderText);
	//create new paragraph element to store actual synopsis
	var filmText = document.createElement("p");
	//grab synopsis from non-related attribute on the element that was clicked and set as inner html of paragraph
	filmText.innerHTML = $(this).attr("usemap");
	//append the things to the div then append div to container
	dDiv.appendChild(filmHeader);
	dDiv.appendChild(filmText);
	container.appendChild(dDiv);
};

//this function has an awful name. it is incredibly long because i wanted to demonstrate the difference between pure javascript
//and jquery ajax requests. good functions should not be this long and should essentially do very few things per function.
//essentially it is the function that handles the main ajax request to TMDb upon a user search.
//it grabs the actor name that is being searched for upon button click or keypress and puts that into a URI
//takes the URI and creates an AJAX request to TMDb with the actors name that returns an object which contains
//various data including name, id, profile image, filmography array and much more.
//I take the response from the first AJAX and parse out the data I need, store those things into arrays,
//sort all of the arrays based off of a chronological sort on the release date array and then clear the contents of main and append all of the images
//for the movies in the searched-for actors filmography to the main page. There are three additional jQuery functions within the doMagic function that 
//pull up a modal with the appropriate movie image when any movie is clicked on from the search, creates an event handler for the vote button on the modal window
//to grab certain attributes (actorID, movieID, actorBio, actorImg, movieImg and movieSynopsis) and sends them via AJAX to  the process_vote.php script, and adds
//the space kitty image if TMDb cannot fetch the desired film image.
function doMagic() {
	var q1 = text.value,					//grab the value for the actor name from the search field
	    q1_r = q1.replace(/\s/g, "+"),		//replace and whitespace with plus signs for the URL query
	    xhr = new XMLHttpRequest(),			//create an xmlHTTPRequest object for the AJAX request
	    url = "",
	    data = "",
	    //palette = "",
	    parsedData = {},
	    parsedData2 = {},
	    id = "",
	    url2 = "",
	    url3 = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500",		//this is needed to prepend to the profile and poster images
	    title = [],
	    releaseDate = [],
	    posterPath = [],
	    movieID = [],
	    myDiv = [],
	    myDivs = [],
	    myAnc = [],
	    myImg = [],
	    myP = [],
	    count = 0;

	//create a query to TMDb with my API key and the name of the actor being searched
	url = addURLParam("http://api.themoviedb.org/3/search/person", "api_key", "a592c64a025525d496607cdd273be6b3");
	url = addURLParam(url, "query", q1_r);
	//this commented out line below will make the search more flexible but less stable
	url = addURLParam(url, "search_type", "ngram");
	//open the XHR object with a get request to the url asynchronously
	xhr.open("get", url, true);
	//set the request headers to expect JSON data back
	xhr.setRequestHeader("Accept", "application/json");
	//when the xhr object is ready do the following function
	xhr.onreadystatechange = function () {
	  //iff the HTTP state is 4 (all good)
	  if (this.readyState == 4) {
		    //and if the XHR status is good
		    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				//store the response of the request into the data variable
				data = xhr.responseText;
				//take the JSON string and parse it as a javascript object
				parsedData = JSON.parse(data);
				//grab the actor ID from the parsed data
				id = parsedData.results[0].id;
				//construct a secont request using the actor ID to get that actors filmography
				url2 = addURLParam("http://api.themoviedb.org/3/person/" + id + "/credits", "api_key", "a592c64a025525d496607cdd273be6b3");
				//iniate the second AJAX request
				xhr.open("get", url2, true);
				xhr.setRequestHeader("Accept", "application/json");
				xhr.onreadystatechange = function () {
				  if (this.readyState == 4) {
					    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
							//if everything is all good, clear the contents of the main page (this is to maintain a single page nature)
							container.innerHTML = "";
							//grab the response from the second AJAX request
							data2 = xhr.responseText;
							//parse the string into an object
							parsedData2 = JSON.parse(data2);
							//grab the cast attribute from the data
							relData2 = parsedData2.cast;
							//sort the release dates chronologically
							relData2.sort(function(a,b) { return parseFloat(a.release_date) - parseFloat(b.release_date) } );
							//for every set in the relData2 object, parse out pertinent info into arrays
							for (var i = 0, len = relData2.length; i < len; i++) {
								title[i] = relData2[i].title;
								posterPath[i] = relData2[i].poster_path;
								releaseDate[i] = relData2[i].release_date;
								movieID[i] = relData2[i].id;
							}
							//if the poster path is null, remove it and all associated data from arrays
							//this only eliminates some of the crud
							for(var pic in posterPath) {
								if (posterPath[pic] == null) {
									var ind = posterPath.indexOf(pic);
									posterPath.splice(ind,1);
									title.splice(ind,1);
									releaseDate.splice(ind,1);
								}
							}
							//append the amazon cloud storage URL to the poster path
							for (var path in posterPath) {
								posterPath[path] = url3 + posterPath[path];
							}

							var actorPic0 = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500" + $.getValues("http://api.themoviedb.org/3/person/"+id+"?api_key=a592c64a025525d496607cdd273be6b3").profile_path;
							var actorBio0 = $.getValues("http://api.themoviedb.org/3/person/"+id+"?api_key=a592c64a025525d496607cdd273be6b3").biography;
							var actorName0 = $.getValues("http://api.themoviedb.org/3/person/"+id+"?api_key=a592c64a025525d496607cdd273be6b3").name;

							//the following code sets actor pictures and bios
							var aDiv = document.createElement("div");
							aDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
							var actorPic = document.createElement("img");
							actorPic.className = "featurette-image img-responsive";
							actorPic.src = actorPic0;
							aDiv.appendChild(actorPic);
							container.appendChild(aDiv);
							var bDiv = document.createElement("div");
							bDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
							var actorHeader = document.createElement("h1");
							//actorHeader.className = "text-center";
							actorHeader.innerHTML = actorName0;
							var actorText = document.createElement("p");
							actorText.innerHTML = actorBio0;
							bDiv.appendChild(actorHeader);
							bDiv.appendChild(actorText);
							container.appendChild(bDiv);

							//for all of the elements in the arrays, create some HTML elements in a four column grid
							//to store a clickable image of each film in the searched for actors filmography.
							//append each of these to the currently empty main page
							//store certain data in various attributes to grab for later functions (bad practice)

							for (var p = 0, len1 = title.length; p < len1; p++) {
								if ((count == 0) || (count % 4 == 0)) {
									myDivs[p] = document.createElement("div");
									myDivs[p].className = "row featurette";
									container.appendChild(myDivs[p]);
								}
								myDiv[p] = document.createElement("div");
								myDiv[p].className = "col-lg-3 col-sm-3 col-md-3 col-xs-6";
								myAnc[p] = document.createElement("a");
								myAnc[p].className = "films";
								//myAnc[p].dataToggle = "modal";
								myAnc[p].href = "#myModal";
								myImg[p] = document.createElement("img");
								myImg[p].className = "featurette-image img-responsive selected";
								myImg[p].src = posterPath[p];
								myImg[p].name = movieID[p];
								myImg[p].dataSrc="holder.js/500x500/auto";
								myImg[p].alt=id;
								myP[p] = document.createElement("p");
								myP[p].className = "text-center relDate";
								myP[p].innerHTML = releaseDate[p].substring(0, releaseDate[p].length-6);
								myAnc[p].appendChild(myImg[p]);
								myDiv[p].appendChild(myAnc[p]);
								myDiv[p].appendChild(myP[p]);
								container.appendChild(myDiv[p]);
								count += 1;
							}
							//set the data toggle for the films class elements for the bootstrap modal
							$( ".films" ).attr("data-toggle", "modal");
							//grab the img source and name from the movie clicked on to add to the modal 
							$('.selected').on("click", function() {
								$('#voteImg').attr("src", $(this).attr("src"));
								$('#voteImg').attr("name", $(this).attr("name"));
								$('#voteImg').attr("alt", $(this).attr("alt"));
							});

							//when the vote button in the modal is clicked, grab some pertinent information from the data stored in the crazy attributes
							//and then send to process_vote.php via AJAX
							$('#vote').on("click", function(event) {
								event.preventDefault();
								//var actID = id;
								var actID = $('#voteImg').attr("alt");
								var movID = $('#voteImg').attr("name");

								//calls the jQuery function defined at the top to store necessary values from ajax requests
								//this is the proper way to do ajax requests. see how much shorter it is.
								//i want to keep all the crud in here to illustrate how much more efficient jQuery AJAX is over pure javascript
								//when i get out of this class i will refactor the code to just use the awesome jQueryness.
								var movieSynopsis = $.getValues("http://api.themoviedb.org/3/movie/"+movID+"?api_key=a592c64a025525d496607cdd273be6b3").overview;
								var movieImg = $.getValues("http://api.themoviedb.org/3/movie/"+movID+"?api_key=a592c64a025525d496607cdd273be6b3").poster_path;
								var actorBio = $.getValues("http://api.themoviedb.org/3/person/"+actID+"?api_key=a592c64a025525d496607cdd273be6b3").biography;

								//this sends the data to process_vote.php so that I can store these variables in the database upon vote
								$.ajax({
									  type: "POST",
									  url: 'http://ps11.pstcc.edu/~c2230a11/site/php/process_vote.php',
									  data: {actorID: actID, movieID: movID, movieSynopsis: movieSynopsis, movieImg: movieImg, actorBio: actorBio},
									  success: function(){
									  	window.location.href = "http://ps11.pstcc.edu/~c2230a11/site/main.php";
									  }
								});

								
							});

							//get all images for films
							//on error, replace with a picture of space cat
							var images = document.getElementsByClassName("featurette-image img-responsive");
							for (var im in images) {
								images[im].onerror = function() {
									this.src = "./img/tom.png";
									//this.style.display = "none";
								};
							}
						} else {
							alert("Request was unsuccessful2: " + xhr.status);
						}
				  	}
				};
				xhr.send(null); //filmography request
			} else {
				alert("Request was unsuccessful1: " + xhr.status);
			}
	  	}
	};
	xhr.send(null); //actor request
}

//The commented-out code below manually scrapes through the first [i] pages on TMDb to create a list of actor names for typeahead.js
//It works by get the name for each actor on each page in the result set and storing the name in an array. Then it joins that array into a single
//string delimited by commas. The code then posts that to a php page which creates a JSON file on the server that typeahead can read from.
//It works, but they way I had it setup was too slow. So I simply used the output of that little bit of code (the array with all the names)
//and coded it locally for speed.

/*
var actorSet;
var dataset = [];
var test;

for(var i = 1; i < 20; i++) {
    actorSet = $.getValues("http://api.themoviedb.org/3/search/person?api_key=a592c64a025525d496607cdd273be6b3&query=*&page=" + i).results;
    actorSet.forEach(function(entry) {
       dataset.push(entry.name); 
    });
}

test = dataset.join(',');
//alert(test);
//$.post('http://ps11.pstcc.edu/~c2230a11/site/php/actorList.php', {nameSet: test});

$('#preSearch1').on("click", function(event) {
	event.preventDefault();
	$.ajax({
		type: "POST",
		url: 'http://ps11.pstcc.edu/~c2230a11/site/php/actorList.php',
		data: {nameSet: test},
	});
});
*/

//This is the actual typehead.js module for auto-complete within search. Like I said above, I did not type out any of the names below,
//I did it programatically through the code above. Then instead of using the generated .json file I just shoved the output into the array below
//for the sake of speed.
$('.typeahead').typeahead({
  name: 'actors',
  local: ["Holly Fink", "Jennifer Lawrence", "Harrison Ford", "Natalie Portman", "Matt Damon", "Hugh Jackman", "Michelle Rodriguez", "Sofía Vergara", "Dwayne Johnson", "Alexandra Daddario", "Martin Freeman", "Sharon Stone", "Anthony Hopkins", "John Carter", "Josh Hutcherson", "Paul Walker", "Milla Jovovich", "Robert Downey Jr.", "Tom Cruise", "Bruce Willis", "Liam Hemsworth", "Jake Gyllenhaal", "Logan Lerman", "Russell Crowe", "Catherine Zeta-Jones", "Tom Hiddleston", "Chris Hemsworth", "Jodie Foster", "Asa Butterfield", "Vin Diesel", "Zoe Saldana", "Jason Statham", "Sharlto Copley", "Olga Kurylenko", "Brad Pitt", "Julianne Moore", "Ed Harris", "Judi Dench", "Génesis Rodríguez", "Srdjan Fink", "Kate Beckinsale", "Ellen Page", "Amy Adams", "Idris Elba", "Olivia Wilde", "Liam Neeson", "George Lucas", "Carrie Fisher", "Sandra Bullock", "Anthony Wong", "Rose Byrne", "Everett Sloane", "Kristin Scott Thomas", "Mark Hamill", "Donnie Yen", "Sarah Silverman", "Morgan Freeman", "Josh Brolin", "Jack Lambert", "Johnny Depp", "Nick Frost", "Arthur Kennedy", "Bradley Cooper", "Johnny Cash", "Saoirse Ronan", "Ian McKellen", "Bob Steele", "Jennifer Aniston", "Karl Urban", "Kevin Bacon", "Tanit Phoenix", "Gianfranco Pagani", "Bob McGraw", "Catherine Keener", "Elisabeth Shue", "Liev Schreiber", "Charlie Hunnam", "Channing Tatum", "James Franco", "Najarra Townsend", "Arnold Schwarzenegger", "Peter Cushing", "ناهد جبر", "Elias Koteas", "Shia LaBeouf", "Al Pacino", "Eric Bana", "Bretaigne Windust", "Gary Oldman", "Bill Cosby", "Sam Levene", "Linda Fiorentino", "Forest Whitaker", "Vince Vaughn", "Yoshifumi Ikeda", "Andrea Riseborough", "Peter Capaldi", "Keira Knightley", "Isabelle Carré", "Walter Matthau", "Nikita Bellucci", "Dustin Ferguson", "Kanako Momota", "Věra Ferbasová", "Jesper Reisinger", "Ming Kai Leung", "Roumella Monge", "Paddy Dunne Cullinan", "Mandeep Tamang", "Jordi Mollà", "刘德华", "John Cusack", "Svetlana Khodchenkova", "Sebastian Koch", "Woody Allen", "Rachel Weisz", "Noah Wyle", "Sanaa Lathan", "Joan Bennett", "Christian Bale", "Evan Rachel Wood", "Emma Stone", "Kate Hudson", "Will Smith", "Vera Farmiga", "Douglas Smith", "Kenneth Branagh", "Jackie Chan", "Monica Bellucci", "Ariadne Shaffer", "Damian Lewis", "Adam Johnson", "Ali Larter", "Gaspard Ulliel", "Don Cheadle", "Dennis To Yue-Hong", "Alan Rickman", "Amanda Seyfried", "Anthony Anderson", "James Mason", "Cuba Gooding, Jr.", "David Strathairn", "Jessica Alba", "Stanley Tucci", "Vanessa Marshall", "Lena Headey", "Timur Bekmambetov", "Patrick Stewart", "Cary Elwes", "Don L. Cash", "Patrick O'Neal", "Jimi Mistry", "Lil' Jon", "Jeroen Krabbe", "Андрей Леонов", "B.E. Taylor", "عقيلة راتب", "Shervin Shoghian", "Tanaquil Le Clerq", "Georges Alépée", "Raj Chakraborty", "Karrie Bauman", "Christina Marie Leonard", "Cherd Songsri", "Néstor Peredo", "Kôzô Uchida", "Setsuko Moriya", "Lau Shut-Yue", "Birger Løvaas", "Daniel Sousa", "Rob Ager", "Keiko Takashima", "Frank Endres", "Justin Breuning", "Edward H. Robins", "Arata Endô", "Reiko Tsumlira", "Hirokiyo Hayasaka", "Gunilla Bresky", "Shirô Kanazawa", "Toshio Senda", "Doris Reichhart", "Stuart J. Prowse", "Frances Macnamarra", "Clifford Pembroke", "MTV", "Stuart Douglass", "Anna SanMartí", "Otto Rubík", "Alesa Kacher", "Matthew Duran", "Shôko Shikamizu", "Miroslav Slaboshpitsky", "Sergiy Gavryluk", "Svetlana Shtanko", "Siddeeqah Powell", "J.J. Winlove", "David Garrick", "Lavínia Bizotto", "Arunya Narmwong", "Sayun Juntawiboon", "Ivan Sadovski", "Phongsakon Chubua", "Buntita Thanwisate", "Akarapol Akarasaranee", "Jenna Coleman", "Nikolaj Coster-Waldau", "Kristen Stewart", "Mel Gibson", "Daniel Radcliffe", "Halle Berry", "Marcia Gay Harden", "Jake Abel", "Michelle Monaghan", "Alicia Witt", "Jason Segel", "Guillaume Canet", "Jordana Brewster", "Alice Braga", "Winona Ryder", "Dana Andrews", "Gene Nelson", "Vincent D'Onofrio", "Selena Gomez", "Marina Hands", "Michael Caine", "Frank Oz", "Joey King", "Ralph Fiennes", "Elijah Wood", "Kôichi Ikari", "Amber Heard", "Tim Conway", "Lili Simmons", "Colin Firth", "Nicolas Cage", "Maria Bello", "Yolanda Jilot", "Angelina Jolie", "Emile Hirsch", "Will Rothhaar", "Adrianne Palicki", "Steve Coogan", "Jane Levy", "Penélope Cruz", "Michael Peña", "Woody Harrelson", "Sterling Hayden", "Naomi Watts", "Pino Accame", "Virginia Madsen", "Sarah Bolger", "Thor Freudenthal", "Mark Strong", "Mark Wahlberg", "Hailee Steinfeld", "Eric Clapton", "Ariana Bagley", "Jeff Cesario", "Véronique Buysse", "Toru Ohno", "Tim Curry", "George Clooney", "Elizabeth Banks", "Robin Wright", "Ryan Reynolds", "Ryan Gosling", "Hugo Weaving", "Katee Sackhoff", "Sienna Guillory", "Billie Piper", "Scarlett Johansson", "Milo Ventimiglia", "John Leguizamo", "Leïla Bekhti", "Dennis Hopper", "Mia Wasikowska", "Nathan Fillion", "Emma Bell", "Zuleika Vargas", "Brandon Baerg", "Paulo Barzman", "Zoltan Seress", "Riley Smith", "Jocelyn Peden", "Andrew Steele", "Rahima Thomas", "Jeff Lewis", "Robert Sloman", "Noomi Rapace", "Nancy Youngblut", "Kyusaku Shimada", "Holly Hunter", "Ciarán Hinds", "Jean-Claude Van Damme", "Alexandra Maria Lara", "Emily Watson", "Zhiwen Wang", "The Zombies", "B.E. Brauner", "Sgt. Tom Kane", "Pascual Aragonés", "Sabir Masani", "B.E. Smith", "Elvis Fuentes", "Park Rim", "Radio Rogues", "Dead Sara", "Jaime Polanco", "Odete Mosso", "Richelle Mead", "Cecília Henriques", "Escar Terry", "Josef Langmiler", "Eduard Dubský", "Zdeněk Hodr", "Jaroslava Panýrková", "František Hanzlík", "Zdeněk Skalický", "Carlos Galiano", "Matt Wood", "Michel Schreiber", "S.S. Balan", "انجي علي", "Rénald Paré", "Nicolo Settegrana", "Dakar", "Curvel Baptiste", "Andreas Kaufmann", "Eric Lin Hui-Ming", "Diego Anjos", "João Carlos", "Martin Fido", "Hakki Haktan", "Kate Lane", "Matt Dreier", "Kerry Lynn", "Gary Everett", "Annie Boyd", "Layette Bucoy", "Tyson Chandler", "Wong Hing-Kan", "Arvo Kukumägi", "Lars Brink", "Tommy Nissen", "Peter Vuust", "Jun Arai", "James McVay", "Milella Giovanna", "Mick Grondahl", "Horiike Kozo", "Vanessa Loh", "Yu Liu", "Amy Goldberger", "Michal Balcerzak", "Walter Raha", "Viktor Marischka", "Lepo Sumera", "Bastien Charrier", "Neïla Terrien", "Antonio Rochira", "Harris Charalambous", "Natasha Lee", "Tetchena Bellange", "Guy Boudreault", "Stephen Faulkner", "Jace Rowley", "Shea Potter", "Hélène Doering", "Alex Polonceau", "Noah Plener", "Diego Cohen", "Bob Fox", "Ethan Zohn", "Erika Landin", "ICS Vortex", "John Chriss", "Yung Tuk-Wai", "david healy", "Bernd Regenauer", "Joven Calub", "Felix Graf", "Anne Dutter", "Aoife Spratt", "Monica DiNatale", "Dana Jesberger", "Tunyaluk Ratchatar", "Mia Grau", "Anton Pleva", "Joa Ritter", "LauraLee Gillum", "Stephen Kaplan", "Ron Rogell", "Kathryn Venverloh", "Jake Cinninger", "Toon Hiranyasup", "Sor Ardsanajingda", "Naowarat Yuktanun", "Maurice Brett", "Travis Moody", "Brandon Jenkins", "Jake Lawson", "Isabella Enzenhofer", "Alice Iversen", "Captain King of Dogs", "Tina Duong", "Grzegorz Zariczny", "Athina TV", "Barbara Bush", "Daniel Poliner", "Cut Keke", "Scott Meek", "Eduardo Chauvet", "Ben", "Jana Ina", "Jesse Money", "Onalea Gilbertson", "Shakti Anand", "Kendra North", "Kyle Killen", "Alicia Gall", "John Martin", "Stefan Hansmire", "N.P.C.C.", "Rattana Pestonji", "Tom Wisawachart", "Eugene 'Porky' Lee", "George 'Spanky' McFarland", "Christos Houliaras", "Marília Araújo", "Dalian Adofo", "Óscar Soria", "Elsa Antequera", "Samuel Anoyke", "Clare Barry", "A.D. Barker", "Georges Monca", "Aki Ema", "Miki Jô", "Kumi Nagisa", "Giichi Nishihara", "Susumu Okano", "Shôji Maehara", "Kazuo Kuramoto", "Tôru Takagi", "Henri Andréani", "Alfredo Bracci", "Mari Ishii", "Koko Noka", "Saburô Kazama", "Tamio Yûmei", "Mari Takami", "Yôko Mikage", "Chen Zhi Kang", "Frank H. Young", "Stefan Denolyubov", "Todor Tanchev", "Sasa Dobrovolná", "Manuel Carrillo", "R. Galaviz", "Art Bartsch", "George Dumpson", "Nutsa Chkheidze", "Věra Líznerová", "Shigeko Hatanaka", "Junko Hijikata", "Masahiko Arima", "Sitara Falcon", "Anthony S. Lenzo", "Demetrios Poulos", "Doris Day", "Suresh Unnithan", "Toby Spanton", "Avanthika Mohan", "John Sarsfield", "Alexandre Espigares", "Antonio Fino", "Uhten Sririwi", "Bernard Mainwaring", "Britt Napier", "Fabio Moon", "Marcos Ozório", "Tristan Bera", "Nick Narciso", "Nick Narciso", "Joey Ginza", "Tomomi Tsukasa", "Kyoko Cakashima", "Osamu Yamashita", "Tamotsu Ono", "Takashi Hama", "Hitoshi Kataoka", "Mizuho Inoue", "Mari Tamiya", "Ryuji Ibuki", "Ryoji Ibuki", "Leo Nishimura", "Kaisunke Akitsu", "Enrico Vaser", "Mario Voller-Buzzi", "DeWolf Hopper Sr.", "Lev Kuleshov", "Philip Rhee", "Tadanori Hashimoto", "Jack Robertson", "Art Young", "Nobuo Ishimori", "Hazel Deane", "Mischa Elman", "Takeichi Saitô", "Lawrence Carra", "Basil Smith", "María Teresa Quirola", "Luis Martínez", "Kôji Kai", "Ilia Avella", "رأفت وجدي", "Иоанна Хмелевская", "Bijesh Jayarajan", "Josef Niznik", "Oliver Hohengarten", "Pascal Rémond", "Taya Nimcharoenpong", "Roger Lion", "Akifumi Kageyama", "Keiichi Ozawa", "Grey Owl", "Kenji Miyako", "Ernesto Giménez Caballero", "Sumiko Minami", "Masayoshi Imako", "Tadashi Sasaki", "Celedonio Flores", "Keiichi Kishimoto", "Toyozô Yamamoto", "Anton Markov", "Adam Baruch", "Ting Hua-Chung", "Shelah Marie", "Steffen Damsgård", "Михаил Кузнецов", "Armando Guerrero", "Harry Bell", "Ian Dimerman", "Ilaria Patané", "Toquinho", "Edu Lobo", "Elizeth Cardoso", "Ellen Smithy", "Blanca Franco", "Lot Smit", "Mireno Scali", "Pranab", "Jahar Roy", "Vivian Hart", "Robban Bäck", "Von Ware", "Scott Kirkpatrick", "Esther Douglas", "Donald Zec", "Lorenzo Garzella", "Adam Cork", "Ric Reid", "Tiziano Paltrinieri", "Yannick Andrei", "Pascal Cambon", "Jules Bishop", "A L Katz", "Robin Dionne", "Jeff Barklage", "Kazvin Dangor", "Dhara Jain", "Adolfo Tapia", "Kim Wall", "Lorena Longoria", "Дарья Барская", "Kathy O'Neill", "William Hellfire", "Tom Hoirer", "Jaco Bidermann", "James Golden", "Sam Gold", "Ford Oelman", "Samantha Glovin", "Yaratan", "Tito Di Míglio", "Deborah Vrizzi", "Giorgio Giampà", "Hugh Hopper", "Elton Dean", "Dato' Haji Jamil Sulong", "Omar Rojik", "Donald Stark", "Patricia Carucci", "Jennifer Derbin", "Tiziano Ferro", "Joseph Garco", "Roberta Kuhn", "Qianmeng Liu", "Lindel Reason", "Paul Forat", "Matt Rolling", "Stefan Mitchell", "Pamela Donegan", "Watkin Tudor Jones", "Kerstin Ramcke", "Péter Politzer", "Samantha", "Jonny Phillips", "Mathieu Lachapelle", "Tiffany Toby", "Pierre-Paul Daunais", "Lyn Caudle", "Bob Trevino", "Edo Basso", "Laura Bau", "Michela Bianchini", "Mara Carpi", "Boy Yniguez", "Max Florian Hoppe", "Elsa Maroussia", "Karl Gysling", "Neil Ellice", "Joan Sweeny", "Deane Ogden", "Chris Arata", "Tamara Yakovlev", "Riho Takada", "Kengo Ohkuchi", "Aglaja Veteranyi", "Leander Lichti", "Marie Burchard", "Bob Sapp", "CKY Crew", "Becky", "Xin Gao", "Teddy", "Emily Yancy", "Simon Lowe", "Nine", "Cindy Wolfe", "Michelle Kirkman", "Eliza Jones", "Φώτης Μεταξόπουλος", "Michael Armstrong", "Sai Sai", "MC Solaar", "Sahar Bishara", "And.Y", "Tootsie Duvall", "Leo Allen", "Paul Gallagher", "Allie Brown", "Elektra", "12 Yard", "Katie Bosland", "Pitbull", "Chris Syner", "Branko Ivanovski Gapo", "Tom Golden", "Ivan Antonov", "Thomas Koerfer", "Julien Dunand", "Natasa Stankovic", "Chanda Oberoi", "Mayumi Yamashita", "Masako Arisawa", "Rena Ogawa", "Ching-Ling Chung", "Emilio Martin", "S. Narayan", "Marc-Olivier Louveau", "Tania Lamarca", "Olivier Zuchuat", "Sarah Jane Decker", "Jacob Cowley", "Trina Lloyd", "Dimitry Kaka", "Luka Lyashenko", "Vicki L. Sawyer", "Surbsak Chalongtham", "Rattanamani Singthong", "Ann Greenway", "Haqiqat Rzayeva", "Boriboon Chanruang", "Richard Ghiani", "Ryan A. Markle", "Michael Allen Williams", "Amphol Lumpoon", "Pattravadee Sritrirat", "Mai Charouenpura", "Nhong ChaChaCha", "Odette Henriette Jacqmin", "Sigourney Weaver", "David Tennant", "John C. Zak", "Peter Falk", "Tilda Swinton", "Chloe Bolota", "Maggie Grace", "Jeff Fahey", "Charlie Sheen", "Lacey Chabert", "Anthony Quinn", "Jim Caviezel", "Orlando Bloom", "Keanu Reeves", "Ashley Johnson", "Franco Nero", "Bobby Moynihan", "Laurence Fishburne", "Megan Fox", "J.J. Abrams", "Kane Hodder", "Natasha Henstridge", "Ethan Hawke", "Leonardo DiCaprio", "Luke Perry", "Rooney Mara", "Henry Fonda", "Lauren Lee Smith", "Anica Dobra", "Michael Fishman", "Julie Delpy", "Charlize Theron", "Harold Perrineau Jr.", "Matt Bomer", "Tim Roth", "Chloë Grace Moretz", "Diane Lane", "Phyllis Brooks", "Brian Tee", "David Morse", "Rob Lowe", "Mary Gladding", "John Hurt", "Christopher Lloyd", "Christopher Nolan", "James Cameron", "Aaron Eckhart", "Dolph Lundgren", "Torrey DeVitto", "Chris Marquette", "Billy Drago", "Michel Gondry", "Anthony Ventura", "Nina Erjomaa", "Pawinee Wiriyachaikit", "Steve Carell", "James Gandolfini", "Dianne Wiest", "Heath Ledger", "Zooey Deschanel", "Sam Elliott", "Carey Mulligan", "Mitch Pileggi", "Stephanie Stallaing", "Michelle Pfeiffer", "Tommi Eronen", "Naomie Harris", "Lili Taylor", "Kirsten Dunst", "Jonathan Taylor Thomas", "Mischa Barton", "Maurício Dias", "Tyler Perry", "Rhona Mitra", "Sean Bean", "Tom Hanks", "Mitsuko Hoshi", "Jean Martin", "Kevin Michael Richardson", "Ian Holm", "Matthew McConaughey", "Rutger Hauer", "Mireille Enos", "Redd Foxx", "Anushka Shetty", "Elisha Cuthbert", "Faye Dunaway", "Jennifer Carpenter", "Michelle Trachtenberg", "Rock Hudson", "Steve Buscemi", "Kristanna Loken", "Yuka Kosaka", "John Travolta", "Zero Mostel", "Famke Janssen", "Josh Hartnett", "Aamir Khan", "Gian Maria Volonté", "Steve Messina", "Rebecca Honig", "Kumi Imura", "Jesse Soffer", "Paul Harvey", "Joel McCrea", "Freddie Highmore", "Ellen Spiro", "Tim Atack", "Maja Miloš", "The Peechees", "Ruffo Geri", "Ollie Carlyle", "Ed Driscoll", "John Hoffman", "Harry Glennon", "Ui Seok Cho", "Hans-Jürgen Tögel", "Phil Gwilliam", "Carole Bardsley", "Rachael Skerritt", "Gopu Babu", "Susan Varon", "Roz Ryan", "Anthony Quinlan", "Carol Leifer", "Ben Rovner", "Goran Kostić", "Lizette Thorne", "Elizabeth Olsen", "Brian Cox", "Ron Livingston", "Aaron Taylor-Johnson", "Hank Azaria", "Paul Dano", "Jonathan Frakes", "Will Yun Lee", "Wyatt Cenac", "Chandler Riggs", "Alfred Hitchcock", "Jim Parsons", "Richard Attenborough", "Jon Voight", "Eric Roberts", "Anna Chancellor", "Karen Gillan", "Brendan Fraser", "Seth MacFarlane", "Taylor Lautner", "Marlon Brando", "Anne Hathaway", "Tanna Frederick", "Vincent Spano", "Jim Carrey", "Wesley Snipes", "Clint Eastwood", "Meryl Streep", "Alex Lifeson", "Bryan Cranston", "Steve McQueen", "Jack Lemmon", "Jerry Lewis", "Chiwetel Ejiofor", "Jeffrey Hunter", "Helena Bonham Carter", "Toshiro Mifune", "Mandy Moore", "Joseph Gordon-Levitt", "Bill Nighy", "Paul Newman", "Vincent Cassel", "Terry O'Quinn", "Katy Perry", "William Sadler", "Ariel Winter", "Cecilia Cheung", "Cillian Murphy", "Jeff Daniels", "Edward Norton", "Sofia Milos", "Kirk Jones", "Chung Him Law", "Andy Linden", "Roger Glover", "Abraham Smith", "Teena Marie", "Anne Wyndham", "Nina Keogh", "Pat LaBorde", "Jackie Jones", "Jackie Kelleher", "Kim Sudol", "Jim Inman", "Debbie Kornblum", "Alika Chee", "Tommy Leap", "Ricky Stout", "Josh Byer", "Oliver Adams", "Megan Duffy", "Patricia King", "Brenda Kamino", "Artur Smolyaninov", "Pat Dinga", "Preston Price", "Keith Cuda", "Jack Quevas", "Amy Palant", "Sam Saboura", "Ava Shamban", "Drew Ogier", "Gino Giacomini", "Mad Mike", "Ann Widdecombe", "Shon Gables", "Ari Rubin", "Iwan Dam", "Dinah", "Tim Paley", "Sally Caves", "Tom Benko", "Lisa Rich", "Robert Beemer", "Vefa Ocal", "Jody Mullenax", "Daphne Pe'a", "Rebel Wilson", "Philip Lott", "David Punch", "Kjell Bergqvist", "Jeremy Sumpter", "John Tyrrell", "Chia Hui Liu", "Chris Irvine", "Sarah Ryan", "Mikuláš Novotný", "Nolan Gerard Funk", "Perlé van Schalkwyk", "Kate Atkinson", "Miley Cyrus", "Nivek Ogre", "Elodie Yung", "Tim Brown", "Jeff Miller", "Lesley Wake", "Joanna Reid", "Lauren Conrad", "Ruth Harrison", "Leslie Bates", "Nick Klein", "Megan Olive", "Peter Dixon", "Cisse Cameron", "Peri Best", "Gerard Logan", "Mark King", "Robert Purdy", "Jim Serpico", "Scott Silveri", "Patricia Lim", "Jeff Garlin", "Alice Barden", "Royana Black", "Tom Blank", "Lucy O'Connell", "John Nolan", "Sarit Catz", "Joan Tabor", "Sha Wu", "Viktor Bychkov", "Анатолий Подшивалов", "Andrea Howard", "Kim Tyler", "Scott Carollo", "Erik Stern", "Michael Shapiro", "Marty York", "Chris Gampel", "Daniel Rosen", "Joe Bassett", "Gabrielle", "Sean Lock", "Jenn Harris", "Bud Molin", "Eric Cazenave", "Vikki Carr", "Eileen Seeley", "Vanessa Bednar"]
});



//simple function that redirects focus to the search button when the enter key is hit within the search box
text.addEventListener("keydown", function(event) {
	var keyCode = event.keyCode;
	if (keyCode == 13) {
    	btn.focus();
  	}
}, false);



//when the search button is clicked, do magic ajax stuff described above
//the false sets the event to bubble and not capture
btn.addEventListener("click", doMagic, false);
//event handler that says when an actor is clicked present his or her biography
$('.actor').on("click", function(event) {
	event.preventDefault();
	var eDiv = document.createElement("div");
	eDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	var efilmPic = document.createElement("img");
	efilmPic.className = "featurette-image img-responsive";
	efilmPic.src = $(this).next().attr("id");
	eDiv.appendChild(efilmPic);
	var fDiv = document.createElement("div");
	fDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	var ffilmHeader = document.createElement("h1");
	var ffilmHeaderText = document.createTextNode("Your Vote: ");
	ffilmHeader.appendChild(ffilmHeaderText);
	var ffilmText = document.createElement("p");
	ffilmText.innerHTML = $(this).next().attr("name");
	fDiv.appendChild(ffilmHeader);
	fDiv.appendChild(ffilmText);
	//clear current contents of the main page
	container.innerHTML = "";
	//create a new div to hold all of the actor/top movie information
	var aDiv = document.createElement("div");
	//apply bootstrap class names to conform to grid with media breakpoints
	aDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	//make a new img element for the actor profile image
	var actorPic = document.createElement("img");
	//give the img responsive class names
	actorPic.className = "featurette-image img-responsive";
	//grab the img src for the actor profile image from the image that was originally clicked on
	actorPic.src = $(this).attr("src");
	//set the data-src attribute per bootstrap placeholder
	actorPic.dataSrc="holder.js/500x500/auto";
	//append the profile image to the div
	aDiv.appendChild(actorPic);
	//append the div to the now empty container
	container.appendChild(aDiv);
	//create another div to hold the bio
	var bDiv = document.createElement("div");
	//apply bootstrap classes to conform to grid
	bDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	//create a header element for the actor name
	var actorHeader = document.createElement("h1");
	//grab the name from the element that was clicked on and set it to the inner html of the actor header
	actorHeader.innerHTML = $(this).attr("alt");
	//create a text element for actor bio
	var actorText = document.createElement("p");
	//grab the bio information from the element that was clicked on and set as inner html of actor text
	actorText.innerHTML = $(this).attr("name");
	//append things to other things
	bDiv.appendChild(actorHeader);
	bDiv.appendChild(actorText);
	//append things to container
	container.appendChild(bDiv);
	//create a div for the top movie info
	var row = document.createElement("div");
	//give the div a bootstrap class name to serve as a row between both section (actor and topmovie)
	row.className = "row featurette";
	//append row to container
	container.appendChild(row);
	//create new div for top movie image with proper bootstrap classnames for the grid
	var cDiv = document.createElement("div");
	cDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	//create an image element for the top movie and set responsive bootstrap classes
	var filmPic = document.createElement("img");
	filmPic.className = "featurette-image img-responsive";
	//grab img src from attribute on the element that was clicked
	//in this case that would be the width. this is a bad practice. don't do this.
	filmPic.src = $(this).attr("width");
	filmPic.dataSrc="holder.js/500x500/auto";
	//append top movie image to div and append div to container
	cDiv.appendChild(filmPic);
	container.appendChild(cDiv);
	//create final div for top movie synopsis with bootstrap grid classnames
	var dDiv = document.createElement("div");
	dDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	//create new header to store a funny title about the synopsis into
	var filmHeader = document.createElement("h1");
	var filmHeaderText = document.createTextNode("The people have spoken: ");
	//append header to top movie synopsis div
	filmHeader.appendChild(filmHeaderText);
	//create new paragraph element to store actual synopsis
	var filmText = document.createElement("p");
	//grab synopsis from non-related attribute on the element that was clicked and set as inner html of paragraph
	filmText.innerHTML = $(this).attr("usemap");
	//append the things to the div then append div to container
	dDiv.appendChild(filmHeader);
	dDiv.appendChild(filmText);
	container.appendChild(dDiv);
	var row2 = document.createElement("div");
	row2.className = "row featurette";
	container.appendChild(row2);
	container.appendChild(eDiv);
	container.appendChild(fDiv);
});


//the following event handler is used to pull up the list of trending actors from TMDb and
//allow users to vote on the just by clicking their image.
$('#trending').on("click", function(event) {
	event.preventDefault();
	var trendingActors = $.getValues("http://api.themoviedb.org/3/person/popular?api_key=a592c64a025525d496607cdd273be6b3").results;
	container.innerHTML = "";
	var count2 = 0;
	var rowDiv = [],
		trendingNames = [],
		trendingAnc = [],
		trendingPics = [];

	//inserting elements into the DOM
	trendingActors.forEach(function(entry) {
		if ((count2 == 0) || (count2 % 4 == 0)) {
			rowDiv[count2] = document.createElement("div");
			rowDiv[count2].className = "row featurette";
			container.appendChild(rowDiv[count2]);
		}
		rowDiv[count2] = document.createElement("div");
		rowDiv[count2].className = "col-lg-3 col-sm-3 col-md-3 col-xs-6";
		trendingAnc[count2] = document.createElement("a");
		//trendingAnc[count2].className = "trendos";
		trendingAnc[count2].href = "#";
		trendingPics[count2] = document.createElement("img");
		trendingPics[count2].className = "featurette-image img-responsive trendos";
		trendingPics[count2].src = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500" + entry.profile_path;
		trendingPics[count2].name = entry.id;
		trendingPics[count2].alt = entry.name;
		trendingNames[count2] = document.createElement("p");
		trendingNames[count2].className = "text-center trendoName";
		trendingNames[count2].innerHTML = entry.name;
		trendingAnc[count2].appendChild(trendingPics[count2]);
		rowDiv[count2].appendChild(trendingAnc[count2]);
		rowDiv[count2].appendChild(trendingNames[count2]);
		container.appendChild(rowDiv[count2]);
		count2 += 1;
	});
	
	//accunting for image errors with cats
	var images = document.getElementsByClassName("featurette-image img-responsive");
	for (var im in images) {
		images[im].onerror = function() {
		this.src = "./img/tom.png";
		//this.style.display = "none";
		};
	}

	//preventing default actions and allowing a click on an actor image to simulate a search for that actor
	$('.trendos').on("click", function(event) {
		event.preventDefault();
		//event.stopPropagation();
		$('.search').val($(this).attr("alt"));
		btn.focus();
		btn.click();
	});

});


//function for joyride tour
$(window).load(function() {
    $('#preSearchRide').joyride({
        autoStart : true,
        modal:true,
        expose: true,
        cookieMonster: true,
    	cookieName: 'JoyRide',
    	cookieDomain: false
    });
});








