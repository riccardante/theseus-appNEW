/*   VARIABILI  */
var divs = ["login", "btn-menu", "splash","menu", "dashboard", "detail", "map", "about", "profilo"];
//,"drawer-controller-hide","drawer-controller-show",  "legend-content","loginForm","legend-position","nuovoIndirizzoForm","nuovoOrdineForm","splashScreen","bacheca"];

var mapID = "riccardante.llg16mdf";
var mapboxAccessToken = "pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw";

var appVersion = "0.9.0";
var apiVersion = "";

var username = "";
var user = "";
var data;
var myTheseusItems;
var map;
var p1;
var myp1;
var pCircle;
var dest;
var destCircle;
var m1;
var m2;
var legend;
var activeTheseus;

// reverse geocoding: http://api.tiles.mapbox.com/v4/geocode/mapbox.places/{lon},{lat}.json?access_token=<your access token>
// http://api.tiles.mapbox.com/v4/geocode/mapbox.places/12.238889,41.800278.json?access_token=pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw

// la posizione va presa dal GPS
var myPosizione = {"lat":"41.800278" , "lon" : "12.238889", "address":"impossibile ottenere la posizione"};

/*
user       "code" => $id_customer,
      "name" => $name, 
      "surname" => $surname, 
      "email" => $email, 
	  "distance_unit" => $distance_unit,


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
					 
					 





/****  VIEW    ****/
function hideAll(appo){
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
}


function showDashboard(){
  username = $("#signin-username").val();
  if(username==""){
	  $("#loginError").html("Please insert a Username");
		return;
  }
  if(user==""){
	getUserData(username, showDashboardCallback);
  }else{
	showDashboardCallback();  
  }
}


function showDashboardCallback(){
  apiVersion = data['version'];
  if(appVersion!=apiVersion){
	  $("#versionMessage").show();
  }
  user = data['user'];
  myTheseusItems = data['item'];
  hideAll(["dashboard", "btn-menu", "menu"]);

  appo="";
  for(i=0;i<myTheseusItems.length ;i++){
	  appo += " <div class='ui-btn ui-input-btn ui-corner-all ui-shadow ui-icon-carat-r ui-btn-icon-right'>";
	  appo += " <input type='button' id='btn-theseus-"+i+"' class='ui-btn ui-corner-all' data-inline='true' data-icon='carat-r' data-iconpos='right' ";
	  appo += " value='"+ myTheseusItems[i]["code"]+"'>"+ myTheseusItems[i]["code"]+"</div>";
  }
  $("#dashboard p").html(appo);
 
  for(j=0;j<myTheseusItems.length ;j++){
	$("#btn-theseus-"+j).bind("click", {msg:j}, showTheseusDetail);
  }
}


function showTheseusDetail(appo){
	  hideAll(["detail", "btn-menu", "menu"]);
	  id_theseus = appo.data.msg;
	  //activeTheseus = id_theseus;
	  
	  
	appo = '<h1>';
    appo += myTheseusItems[id_theseus]["code"];
    appo += '</h1>';
	appo += '<p>Position:<br/><span id="span-posizione"></span >'; ////// + myTheseusItems[id_theseus]["posizione"]["address"];

	appo += '<br/>Date:<br/>' + myTheseusItems[id_theseus]["posizione"]["date"];

//	appo += '<br/>Distance:<br/>XXXX'  	;


	appo += '<button id="btn-map" class="ui-btn ui-icon-carat-r ui-btn-icon-right ui-shadow ui-corner-all">Show map</button>';

	appo += '<button id="btn-history" class="ui-btn ui-icon-carat-r ui-btn-icon-right ui-shadow ui-corner-all">Show history</button>';
	  
	appo += '<button id="btn-getPosition" class="ui-btn ui-icon-refresh ui-btn-icon-right ui-shadow ui-corner-all">Update position</button>';
	  
	appo += '</p>';
	
	$("#detail p").html(appo);
	
	$("#btn-map").bind("click", {msg:id_theseus}, showTheseusMap);
	$("#btn-history").bind("click", {msg:id_theseus}, showTheseusHistory);
	$("#btn-getPosition").bind("click", {msg:id_theseus}, getPosition);
	
	
}

function getPosition(appo){
	id_theseus = appo.data.msg;
	$.ajax({
		method       : "POST",
		data       : {id : id_theseus},
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/updatePosition.php"
	})
	.done(function (msg) {
			myTheseusItems[id_theseus]['posizione'] = msg;
			showTheseusMap(id_theseus);
			appo = setTimeout(getPositionDelayedCall,2000); 

        })
	.fail(function (jqXHR, textStatus, errorThrown) {
			//data = {"user":{"code":"1","name":"Riccardo","surname":"Berti","email":"riccardo.berti@gmail.com","distance_unit":"KM"},"item":[{"type":"standalone","code":"PROTO-001","color":"blue","photo":"style\/images\/theseus_blue.png","posizione":{"lat":"51.469815","lon":"-0.453877","date":"","address":"Via Ridolfino Venuti 25, Roma, ITALIA"}},{"type":"standalone","code":"PROTO-1X2","color":"black","photo":"style\/images\/theseus_black.png","posizione":{"lat":"41.794756","lon":"12.249127","date":"","address":"Via Leonardo da Vinci, Roma, ITALIA"}}]};
			//callback();
			$("#editError").html("An error has occurred in updating data.")	;
			appo = setTimeout(getPositionDelayedCall,2000); 
			return;
			
        });
		
	return;
	
}

function getPositionDelayedCall(){
	showTheseusMap(id_theseus);
}

function showTheseusHistory(appo){
	  hideAll(["map", "btn-menu", "menu"]);
	  id_theseus = appo.data.msg;
}


function showTheseusMap(appo){
	  hideAll(["map", "btn-menu", "menu"]);
	  id_theseus = appo.data.msg;
	  
	  posizione = myTheseusItems[id_theseus]['posizione'];
	  getAddress(posizione);

  //document.getElementById("legend-position").style.display = "block";
  //document.getElementById("legend-actionbar").style.display = "block";

  //document.getElementById("homeCourier").style.display = "block";
  //document.getElementById("addtitle").innerHTML=" - " + myTheseusItems[0]['code'];
  
  
  if(typeof(map) == "undefined" ){  
    map =  L.mapbox.map('map', mapID).setView([posizione.lat, posizione.lon], 8);
	//map.addControl(L.mapbox.legendControl());
	
	map.legendControl.addLegend(document.getElementById('legend').innerHTML);
  }else{
    map.setView([posizione.lat, posizione.lon], 8)
  }
//  if(myp1!=undefined){map.removeLayer(myp1);}
//  myp1=L.marker([myPosizione.lat, myPosizione.lon],{icon:L.mapbox.marker.icon({'marker-size':'medium','marker-symbol':'star','marker-color':'#ff0000'})}).addTo(map);
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

  $("#btn-back").bind("click", {msg:id_theseus}, showTheseusDetail);

  
//  if(m1!=undefined){map.removeLayer(m1);}
//  if(m2!=undefined){map.removeLayer(m2);}
//  if(dest!=undefined){map.removeLayer(dest);}
//  if(destCircle!=undefined){map.removeLayer(destCircle);}
  
  //document.getElementById("legend-content").style.display = "none";
  //document.getElementById("legend-position").style.display = "none";  //////////////// RIAGGIUNGI !!!!!!

}

//function back
// 	$("#btn-back").bind("click", {msg:j}, showTheseusDetail);


function showProfile(){
  hideAll(["profilo", "btn-menu", "menu"]);
  appo = username;
  appo += "<br/>" +user['name'] + " " + user['surname'];
  appo += "<br/>" + user['email'];
  //appo += "<br/>unit: " + user['distance_unit'];
  
  appo += "<br/><div class='ui-btn ui-input-btn ui-corner-all ui-shadow ui-icon-carat-r ui-btn-icon-right'>EDIT<input type='button' id='btn-editUser' class='ui-btn ui-corner-all' data-inline='true' data-icon='carat-r' data-iconpos='right' value='Edit'></div>";
  $("#profilo p").html(appo);
  $("#btn-editUser").bind("click", editUser);
}


function editUser(){
  hideAll(["profilo", "btn-menu", "menu"]);
  appo = "";
  appo += "<div id='editError'></div>";
  appo += "<form><input type='hidden' name='code' value='"+user['code']+"'>";
  appo += "Username:<br/> <b>"+username+"</b> ";
  appo += "<br/>" + "Name: <br/><input id='edt-user-name' name='name' value='"+user['name']+"' >";  
  appo += "<br/>" + "Surname: <br/><input id='edt-user-surname' name='surname' value='"+user['surname']+"' >";  
  appo += "<br/>" + "Email: <br/><input id='edt-user-email' name='email' value='"+user['email']+"' >";  
//  appo += "<br/>" + "Distance Unit: <br/>Km";  
  
  /*
  appo += "<br/><fieldset data-theme='a' data-role='controlgroup' data-type='horizontal' class='ui-controlgroup ui-controlgroup-horizontal ui-corner-all'><legend>Distance Unit:</legend>";
  appo += "<div class='ui-controlgroup-controls'>";
  appo += "<div class='ui-radio'><label for='radio-choice-h-2a' class='ui-btn ui-corner-all ui-btn-inherit ui-radio-on ui-btn-active ui-first-child'>Km</label>";
  appo += "<input type='radio' name='radio-choice-h-2' id='radio-choice-h-2a' value='KM' checked='checked'></div>";
  appo += "<div class='ui-radio'><label for='radio-choice-h-2b' class='ui-btn ui-corner-all ui-btn-inherit ui-radio-off ui-last-child'>Miles</label>";
  appo += "<input type='radio' name='radio-choice-h-2' id='radio-choice-h-2b' value='MI' disabled='disabled'></div>";
  appo += "</div></fieldset>";
  
  */
  
  //appo += "<br/>unit: " + user['distance_unit'];
  
  appo += "<br/><a href='#' id='btn-submitUser' class='ui-btn ui-corner-all'>SUBMIT</a>";
  appo += "</form>";
  $("#profilo p").html(appo);
  $("#btn-submitUser").bind("click", submitUser);
	
}

function submitUser(){
	$.ajax({
		method       : "POST",
		data       : {username : username, code:user['code'], name: $("#edt-user-name").val(), surname:$("#edt-user-surname").val(), email:$("#edt-user-email").val() },
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/updateUserData.php"
	})
	.done(function (msg) {
			getUserData(username, showDashboardCallback);
        })
	.fail(function (jqXHR, textStatus, errorThrown) {
			$("#editError").html("An error has occurred in updating data.")	;
			appo = setTimeout(submitUserDelayedCall,2000); 
			return;
        });
		
	return;
	
}

function submitUserDelayedCall(){
	getUserData(username, showDashboardCallback);
}

function showAbout(){
  hideAll(["about", "btn-menu", "menu"]);
	
}


function logOff(){
	data="";
	user="";
	myTheseusItems="";
	showLoginForm();
}









/*   CONTROLLER   */
function startApp(){
	  hideAll(["splash"]);
}


/********* GET DATA FROM SERVER  *************/
function getUserData(username, callback){
	$.ajax({
		method       : "POST",
		data       : {username : username},
		crossDomain: true,
		dataType   : 'json',
        url: "http://theseus-sms.azurewebsites.net/getUserData.php"
	})
	.done(function (msg) {
			data = msg;
			callback();
        })
	.fail(function (jqXHR, textStatus, errorThrown) {
			data = {"user":{"code":"1","name":"Riccardo","surname":"Berti","email":"riccardo.berti@gmail.com","distance_unit":"KM"},"item":[{"type":"standalone","code":"PROTO-001","color":"blue","photo":"style\/images\/theseus_blue.png","posizione":{"lat":"51.469815","lon":"-0.453877","date":"","address":"Via Ridolfino Venuti 25, Roma, ITALIA"}},{"type":"standalone","code":"PROTO-1X2","color":"black","photo":"style\/images\/theseus_black.png","posizione":{"lat":"41.794756","lon":"12.249127","date":"","address":"Via Leonardo da Vinci, Roma, ITALIA"}}]};
			callback();
        });
		
	return;
	
}

/*
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

	});
}
*/

function getAddress(appo){
  url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+appo.lon+","+appo.lat+".json?access_token="+mapboxAccessToken;
  $.getJSON( url, function( data ) {
    posizione.address=data.features[0].place_name;
    document.getElementById("span-posizione").innerHTML = posizione.address;
  });
}


function _orientationHandler(){
	//alert(window.innerHeight);
    $("#map").css("height",window.innerHeight);
	if(typeof(map) != "undefined" ){   setTimeout(map.invalidateSize(),800); }
/*
	//alert(window.orientation + event.orientation);
	if(event.orientation){
		  if(event.orientation == 'portrait'){
					  //do something
					  alert("port");
		  }
		  else if(event.orientation == 'landscape') {
						//do something
						alert("land");
		  }
	}
*/	
}



/***   POSIZIONE  ***/
function getMobilePosition(){
  navigator.geolocation.getCurrentPosition(getPositionOnSuccess, getPositionOnError);
}

function getDistance(p1,p2){
	// https://www.mapbox.com/mapbox.js/example/v1.0.0/marker-distances/
	var fc = p1.getLatLng();
	var c = p2.getLatLng();
	distance = "";
	distanceM = (fc.distanceTo(c)).toFixed(0); 
	distanceKM = ((fc.distanceTo(c))/1000).toFixed(0);
	if(distanceKM=="0"){
		distance = distanceM + " m";
	}else{
		distance = distanceKM + " Km";
	}
	return distance;
}

var getPositionOnSuccess = function (position) {
   console.log('Latitude: ' + position.coords.latitude + '\n' +     'Longitude: ' + position.coords.longitude + '\n');
   myPosizione.lat = position.coords.latitude ;
   myPosizione.lon = position.coords.longitude ;
   //ridisegnaMappa();
   //getAddress();
};

function getPositionOnError(error) {
  //document.getElementById("leg-posizione").innerHTML = "impossibile determinare la posizione";
    console.log('Error getting GPS Data');
}







/*   ONLOAD  */
window.onload = function () {
  $("#map").css("height",window.innerHeight);
  //alert(window.innerHeight);

  // aggiungo i listner	
  $("#splash").bind("click", showLoginForm);
  $("#bFormSignIn").bind("click", showDashboard);
  $("#mnu-dashboard").bind("click", showDashboard);
  $("#mnu-profile").bind("click", showProfile);
  $("#mnu-about").bind("click", showAbout);
  $("#mnu-logoff").bind("click", logOff);
  $(window).bind('orientationchange', _orientationHandler);
  $(document).bind('orientationchange', _orientationHandler);
  
  
  // LISTNER PARAMETRICO  $("#splash").bind("click", VARIABILE, showLoginForm);

  //console.log(altezza); // NaN
  getMobilePosition();
  startApp();
};