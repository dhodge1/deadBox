var form = document.getElementById("form1"),
	text = document.getElementById("text1"),
	btn = document.getElementById("button1"),
	container = document.getElementById("content"),
	anchors = document.getElementsByClassName("thumbs");

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

function addURLParam(url, name, value) {
	url += (url.indexOf("?") == -1 ? "?" : "&");
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
}

function presentBio() {
	container.innerHTML = "";
	var aDiv = document.createElement("div");
	aDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	var actorPic = document.createElement("img");
	actorPic.className = "featurette-image img-responsive";
	actorPic.src = $(this).attr("src");
	actorPic.dataSrc="holder.js/500x500/auto";
	aDiv.appendChild(actorPic);
	container.appendChild(aDiv);
	var bDiv = document.createElement("div");
	bDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	var actorHeader = document.createElement("h1");
	actorHeader.innerHTML = $(this).attr("alt");
	//var actorHeaderText = document.createTextNode("Actor Bio");
	//actorHeader.appendChild(actorHeaderText);
	var actorText = document.createElement("p");
	actorText.innerHTML = $(this).attr("name");
	//var actorBioText = document.createTextNode("This will be text describing the bio for each actor. Stuff pulled directly from TMDb like name, birthday/place, family, notable roles, etc. It will be dynamic to each actor. A headshot for the actor will display directly to the left as opposed to a completely normal picture of Tom Hanks.");
	//actorText.appendChild(actorBioText);
	bDiv.appendChild(actorHeader);
	bDiv.appendChild(actorText);
	container.appendChild(bDiv);
	var row = document.createElement("div");
	row.className = "row featurette";
	container.appendChild(row);
	var cDiv = document.createElement("div");
	cDiv.className = "col-lg-4 col-sm-4 col-md-4 col-xs-4";
	var filmPic = document.createElement("img");
	filmPic.className = "featurette-image img-responsive";
	filmPic.src = $(this).attr("width");
	filmPic.dataSrc="holder.js/500x500/auto";
	cDiv.appendChild(filmPic);
	container.appendChild(cDiv);
	var dDiv = document.createElement("div");
	dDiv.className = "col-lg-8 col-sm-8 col-md-8 col-xs-8"
	var filmHeader = document.createElement("h1");
	var filmHeaderText = document.createTextNode("The people have spoken: ");
	filmHeader.appendChild(filmHeaderText);
	var filmText = document.createElement("p");
	filmText.innerHTML = $(this).attr("usemap");
	//var filmBioText = document.createTextNode("This will be a short synopsis of the movie that has received the most votes. Once again, this will be dynamic for each movie and pulled from TMDb. It will also display the total number of votes for this film. You will only see the movie that has the most votes, not the movie for which you voted.");
	//filmText.appendChild(filmBioText);
	dDiv.appendChild(filmHeader);
	dDiv.appendChild(filmText);
	container.appendChild(dDiv);
};

function doMagic() {
	var q1 = text.value,
	    q1_r = q1.replace(/\s/g, "+"),
	    xhr = new XMLHttpRequest(),
	    url = "",
	    data = "",
	    //palette = "",
	    parsedData = {},
	    parsedData2 = {},
	    id = "",
	    url2 = "",
	    url3 = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500",
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

	url = addURLParam("http://api.themoviedb.org/3/search/person", "api_key", "a592c64a025525d496607cdd273be6b3");
	url = addURLParam(url, "query", q1_r);
	//prompt("hi", url);
	//url = addURLParam(url, "search_type", "ngram");
	xhr.open("get", url, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function () {
	  if (this.readyState == 4) {
		    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				//palette = document.getElementById("resp");
				//palette.innerHTML = xhr.responseText;
				data = xhr.responseText;
				parsedData = JSON.parse(data);
				id = parsedData.results[0].id;
				//alert(id);
				url2 = addURLParam("http://api.themoviedb.org/3/person/" + id + "/credits", "api_key", "a592c64a025525d496607cdd273be6b3");
				xhr.open("get", url2, true);
				xhr.setRequestHeader("Accept", "application/json");
				xhr.onreadystatechange = function () {
				  if (this.readyState == 4) {
					    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
							container.innerHTML = "";
							data2 = xhr.responseText;
							parsedData2 = JSON.parse(data2);
							relData2 = parsedData2.cast;
							relData2.sort(function(a,b) { return parseFloat(a.release_date) - parseFloat(b.release_date) } );
							for (var i = 0, len = relData2.length; i < len; i++) {
								title[i] = relData2[i].title;
								posterPath[i] = relData2[i].poster_path;
								releaseDate[i] = relData2[i].release_date;
								movieID[i] = relData2[i].id;
							}
							for(var pic in posterPath) {
								if (posterPath[pic] == null) {
									var ind = posterPath.indexOf(pic);
									posterPath.splice(ind,1);
									title.splice(ind,1);
									releaseDate.splice(ind,1);
								}
							}
							for (var path in posterPath) {
								posterPath[path] = url3 + posterPath[path];
							}

							//array_multisort(releaseDate, movieID, 'SORT_STRING', posterPath);

							//for (var j = 0, leng = title.length; j < leng; j++) {
							//	container.innerHTML += "Title: " + title[j] + "<br/> Poster Path: " + posterPath[j] + "<br/> Release Date: " + releaseDate[j] + "<br/><br/>";
							//}
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
							$( ".films" ).attr("data-toggle", "modal");
							$('.selected').on("click", function() {
								$('#voteImg').attr("src", $(this).attr("src"));
								$('#voteImg').attr("name", $(this).attr("name"));
							});

							$('#vote').on("click", function(event) {
								event.preventDefault();
								var actID = id;
								var movID = $('#voteImg').attr("name");

								var movieSynopsis = $.getValues("http://api.themoviedb.org/3/movie/"+movID+"?api_key=a592c64a025525d496607cdd273be6b3").overview;
								var movieImg = $.getValues("http://api.themoviedb.org/3/movie/"+movID+"?api_key=a592c64a025525d496607cdd273be6b3").poster_path;
								var actorBio = $.getValues("http://api.themoviedb.org/3/person/"+actID+"?api_key=a592c64a025525d496607cdd273be6b3").biography;

								//alert(movieSynopsis);
								//alert(movieImg);
								//alert(actorBio);

								$.ajax({
									  type: "POST",
									  url: 'http://ps11.pstcc.edu/~c2230a11/site/php/process_vote.php',
									  data: {actorID: actID, movieID: movID, movieSynopsis: movieSynopsis, movieImg: movieImg, actorBio: actorBio},
									  success: function(){
									  	window.location.href = "http://ps11.pstcc.edu/~c2230a11/site/main.php";
									  }
								});

								
							});

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

text.addEventListener("keydown", function(event) {
	var keyCode = event.keyCode;
	if (keyCode == 13) {
    	btn.focus();
  	}
}, false);


btn.addEventListener("click", doMagic, false);
$('.actor').on("click", presentBio);




