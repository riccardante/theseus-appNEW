/*   VARIABILI  */
var divs = ["login", "btn-menu", "splash","menu", "dashboard", "detail", "map", "about", "profilo"];
//,"drawer-controller-hide","drawer-controller-show",  "legend-content","loginForm","legend-position","nuovoIndirizzoForm","nuovoOrdineForm","splashScreen","bacheca"];
var mapID = "riccardante.llg16mdf";
var mapboxAccessToken = "pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw";

var username = "";
var map;
var p1;
var myp1;
var pCircle;
var dest;
var destCircle;
var m1;
var m2;
var legend;


// reverse geocoding: http://api.tiles.mapbox.com/v4/geocode/mapbox.places/{lon},{lat}.json?access_token=<your access token>
// http://api.tiles.mapbox.com/v4/geocode/mapbox.places/12.238889,41.800278.json?access_token=pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw

// la posizione va presa dal GPS
var myPosizione = {"lat":"41.800278" , "lon" : "12.238889", "address":"impossibile ottenere la posizione"};

var myTheseusItems;
/*
var myTheseusItems = [{"type":"standalone", 
					   "code":"PROTO-001", 
					   "color":"blue",  
					   "photo":"style/images/theseus_blue.png",
					   // via venuti "posizione" : {"lat":"41.921224" , "lon" : "12.519920", "date":"", "address":"Via Ridolfino Venuti 25, Roma, ITALIA"}
						// CDG "posizione" : {"lat":"49.00843150811774" , "lon" : "2.542905807495117", "date":"", "address":"Via Ridolfino Venuti 25, Roma, ITALIA"}					   
						"posizione" : {"lat":"51.469815" , "lon" : "-0.453877", "date":"", "address":"Via Ridolfino Venuti 25, Roma, ITALIA"}
																
						},										
// 41.855779, 12.470311 Via Vito Volterra 62, Roma, ITALIA
                      {"type":"standalone", 
					   "code":"PROTO-002", 
					   "color":"black", 
					   "photo":"style/images/theseus_black.png",
					   "posizione" : {"lat":"41.794756" , "lon" : "12.249127", "date":"", "address":"Via Leonardo da Vinci, Roma, ITALIA"}
					  }
					 ];

*/
					 
					 




/*   CONTROLLER   */
function startApp(){
	  hideAll(["splash"]);
}


/********* GET DATA FROM SERVER  *************/
function getUser(username, callBack){
	console.log("getUser");
	$("#loginError").html("getUser");
	
	$.ajax({
		method       : "POST",
		data       : {username : 'username'},
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/getUser.php"
	})
	.done(function (msg) {
			user = msg;
			$("#loginError").html("getUser SUCCESS");
			showDashboardCallback();
        })
	.fail(function (jqXHR, textStatus, errorThrown) {
			user = textStatus;
			$("#loginError").html("getUser FAIL" + textStatus);
			showDashboardCallback();
        });
		
	return;
	
	
	/*
	$.ajax({
		type       : "POST",
		data       : {username : 'username'},
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/getUser.php",
        error: function (jqXHR, textStatus, errorThrown) {
			$("#loginError").html("ERROR");
			console.log("ERROR");
	$("#loginError").html("getUser ERROR");
			
            console.log(jqXHR);
			// FAKE USER
			user = [{
				"code":"1",
				"name":"FAKE", 
				"surname":"Berti", 
				"email":"riccardo.berti@gmail.com", 
				"image":"style/images/riccardo.jpg", 
				"mobile":"+39-320-3918907",
				"password":"",
			}];
			//showDashboardCallback();
			//getMyTheseus();
			//return true;
        },
        success: function (msg) {
			user = msg;
			$("#loginError").html("getUser SUCCESS");
			//return showDashboardCallback();
			//getMyTheseus();
			//return true;
        },
		complete: function
    });
*/

	
	/*
  if(username=="riccardante"){
      user = [{
      "code":"1",
      "name":"Riccardo", 
      "surname":"Berti", 
      "email":"riccardo.berti@gmail.com", 
      "image":"style/images/riccardo.jpg", 
      "mobile":"+39-320-3918907",
      "password":"",
	}];
	getMyTheseus();
	return true;
  }else if(username=="giuseppe"){
      user = [{
      "code":"2",
      "name":"Giuseppe", 
      "surname":"Reale", 
      "email":"giusepperealeg@gmail.com", 
      "image":"style/images/giuseppe.jpg", 
      "mobile":"+39-328-0833271",
      "password":"",
	}];
	return true;
  }else{
	  $("#loginError").html("Wrong login");
	  showLoginForm();
	  return false;
  }
  */
}


function getMyTheseus(callBack){
	// http://theseus-sms.azurewebsites.net/getItems.php
	//myTheseusItems
	
	$.ajax({
		type       : "POST",
		data       : {username : 'username'},
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/getItems.php",
        error: function (jqXHR, textStatus, errorThrown) {
			$("#loginError").html("ERROR");

			console.log("ERROR");
            console.log(jqXHR);
			// FAKE COORDS
			myTheseusItems = [{"type":"standalone", 
					   "code":"FAKE-001", 
					   "color":"blue",  
					   "photo":"style/images/theseus_blue.png",
						"posizione" : {"lat":"51.469815" , "lon" : "-0.453877", "date":"", "address":"Via Ridolfino Venuti 25, Roma, ITALIA"}
																
						},										
                      {"type":"standalone", 
					   "code":"PROTO-002", 
					   "color":"black", 
					   "photo":"style/images/theseus_black.png",
					   "posizione" : {"lat":"41.794756" , "lon" : "12.249127", "date":"", "address":"Via Leonardo da Vinci, Roma, ITALIA"}
					  }
					 ];
			callBack();
        },
        success: function (msg) {
				  $("#loginError").html("SUCCESS");

			console.log("SUCCESS");
			myTheseusItems=msg;
            console.log(msg);
			callBack();
        }
    });
	showDashboardCallback();
	return;
	
	$.getJSON( "http://theseus-sms.azurewebsites.net/getItems.php", function( data ) {
		alert(data);
		//myTheseusItems=data;
		/*
	  var items = [];
	  $.each( data, function( key, val ) {
		items.push( "<li id='" + key + "'>" + val + "</li>" );
	  });
	 
	  $( "<ul/>", {
		"class": "my-new-list",
		html: items.join( "" )
	  }).appendTo( "body" );
	  */
	});
	/*
	$.ajax({
		url: "http://theseus-sms.azurewebsites.net/getItems.php",
		context: document.body
	}).done(function() {
		$( this ).addClass( "done" );
	});
	*/
}


function getAddress(){
  url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+posizione.lon+","+posizione.lat+".json?access_token="+mapboxAccessToken;
  $.getJSON( url, function( data ) {
    posizione.address=data.features[0].place_name;
    console.log(posizione.address);
    //document.getElementById("leg-posizione").innerHTML = posizione.address;
  });
}


/****  VIEW    ****/
function hideAll(appo){
	/*
  for(i=0;i<divs.length;i++){
	  if(divs[i]==appo[0]){
		$("#"+divs[i]).show();
	  }else{
		  $("#"+divs[i]).hide();
		}
  }
  */
  for(i=0;i<divs.length;i++){
	  $("#"+divs[i]).hide();
  }
  for(i=0;i<divs.length;i++){
	  for(j=0;j<appo.length;j++){
		if(divs[i]==appo[j]){
			$("#"+divs[i]).show();
		}
	  }
  }
  
}


function showLoginForm(){
	hideAll(["login"]);
	//getMyTheseus();
	
	
	//$("#login").show();
	/*
  document.getElementById("splash").style.display = "none";  
  document.getElementById("login").style.display = "block";  
	showDrawerController();
	document.getElementById("loginForm").style.display = "block";
	document.getElementById("addtitle").innerHTML=" - LOGIN";
*/
}

function getUserCallback(){
	$("#loginError").html("getUser callback - " + user[0].name);

	//console.log(user[0].name);
	getMyTheseus(showDashboardCallback);
}

function showDashboard(){

  $("#loginError").html("WAITING ..");
	
  username = $("#signin-username").val();
  if(username==""){
	  $("#loginError").html("Please insert a Username");
		return;
  }
  
  
  
  getUser(username, getUserCallback);

  /*
  if(!getUser(username)){
  	  $("#loginError").html("ERROR!");
	  //return;
  }  
	*/
	//getMyTheseus(showDashboardCallback);
  
  
  
}

function showDashboardCallback(){
	  var appo="<ul>";
  for(i=0;i<myTheseusItems.length ;i++){
    appo += '<li><h1 class="communicationTitle">';
    appo += myTheseusItems[i]["code"];
    appo += '</h1><p>';
    appo += '<div id="btn-theseus-'+i+'"><img src="'+myTheseusItems[i]['photo']+'" /></div>';
    appo += '</p></li>';
  }
  appo += '</ul>';
  $("#dashboard p").html(appo);
  
  hideAll(["dashboard", "btn-menu", "menu"]);
 
  for(j=0;j<myTheseusItems.length ;j++){
	$("#btn-theseus-"+j).bind("click", {msg:j}, showTheseusMap);
  }

}

function showTheseusMap(appo){
	  hideAll(["map", "btn-menu", "menu"]);
	  id_theseus = appo.data.msg;
	  
	  posizione = myTheseusItems[id_theseus]['posizione'];
	  getAddress();

  //document.getElementById("legend-position").style.display = "block";
  //document.getElementById("legend-actionbar").style.display = "block";

  //document.getElementById("homeCourier").style.display = "block";
  //document.getElementById("addtitle").innerHTML=" - " + myTheseusItems[0]['code'];
  
  
  if(typeof(map) == "undefined" ){  
    map =  L.mapbox.map('map', mapID).setView([posizione.lat, posizione.lon], 8);
  }else{
    map.setView([posizione.lat, posizione.lon], 8)
  }
  if(myp1!=undefined){map.removeLayer(myp1);}
  myp1=L.marker([myPosizione.lat, myPosizione.lon],{icon:L.mapbox.marker.icon({'marker-size':'medium','marker-symbol':'star','marker-color':'#ff0000'})}).addTo(map);
  if(pCircle!=undefined){map.removeLayer(pCircle);}  
  pCircle = L.circle([posizione.lat, posizione.lon], 3000).addTo(map);
  if(p1!=undefined){map.removeLayer(p1);}
  p1 = L.marker([posizione.lat, posizione.lon], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'medium',
      'marker-symbol': 'star',
      'marker-color': '#1087bf'
    })
  }).addTo(map);
  
  if(m1!=undefined){map.removeLayer(m1);}
  if(m2!=undefined){map.removeLayer(m2);}
  if(dest!=undefined){map.removeLayer(dest);}
  if(destCircle!=undefined){map.removeLayer(destCircle);}
  
  //document.getElementById("legend-content").style.display = "none";
  //document.getElementById("legend-position").style.display = "none";  //////////////// RIAGGIUNGI !!!!!!

}

function showProfile(){
  hideAll(["profilo", "btn-menu", "menu"]);
  appo = user[0].name + " " + user[0].surname;
  $("#profilo p").html(appo);

}



/*   ONLOAD  */
window.onload = function () {
  // aggiungo i listner	
  $("#splash").bind("click", showLoginForm);
  $("#bFormSignIn").bind("click", showDashboard);
  $("#mnu-dashboard").bind("click", showDashboard);
  $("#mnu-profile").bind("click", showProfile);
  
  // LISTNER PARAMETRICO  $("#splash").bind("click", VARIABILE, showLoginForm);

  //altezza= window.innerHeight - $("#header").css("height");
  //console.log(altezza); // NaN
  $("#map").css("height",window.innerHeight);
  startApp();
	$("#splash").show(1);

};