var form = document.getElementById("form1"),
	text = document.getElementById("text1"),
	btn = document.getElementById("button1"),
	container = document.getElementById("content"),
    xhr = new XMLHttpRequest(),
    url = "",
    obj = {};

function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

//url = "http://api.themoviedb.org/3/search/person?api_key=a592c64a025525d496607cdd273be6b3&query=*";
url = addURLParam("http://api.themoviedb.org/3/search/person", "api_key", "a592c64a025525d496607cdd273be6b3");
url = addURLParam(url, "query", "*");
url = addURLParam(url, "page", "10");
xhr.open("get", url, false);
xhr.setRequestHeader("Accept", "application/json");
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
		    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                obj = JSON.parse(xhr.responseText);
                //for (var i = 1; i <= 10; i++) {
                //obj.page = 3;
                for (var res in obj.results) {
                    container.innerHTML += obj.results[res].name + "<br />";
                }
                //}
            } 
    } else {
       alert("Request was unsuccessful1: " + xhr.status);
    }
};

xhr.send(null);