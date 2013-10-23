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
								//myImg[p].alt="Generic placeholder image";
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
							});

							//when the vote button in the modal is clicked, grab some pertinent information from the data stored in the crazy attributes
							//and then send to process_vote.php via AJAX
							$('#vote').on("click", function(event) {
								event.preventDefault();
								var actID = id;
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

/*$('.typeahead').typeahead({
  name: 'actors',
  local: [
  		"will smith",
  		"brad pitt",
  		"natalie portman",
  		"gary oldman"
  ]
});*/

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
$('.actor').on("click", presentBio);




