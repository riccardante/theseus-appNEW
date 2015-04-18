/*   VARIABILI  */
var divs = ["login", "menuBtn", "benvenuti", "splash","menu", "homeTheseus", "homeClient", "homeCourier",  "aboutApp","drawer-controller-hide","drawer-controller-show", "profilo", "legend-content","loginForm","legend-position","nuovoIndirizzoForm","nuovoOrdineForm","splashScreen","bacheca"];
var mapID = "riccardante.llg16mdf";
var mapboxAccessToken = "pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw";

var username = "";


// reverse geocoding: http://api.tiles.mapbox.com/v4/geocode/mapbox.places/{lon},{lat}.json?access_token=<your access token>
// http://api.tiles.mapbox.com/v4/geocode/mapbox.places/12.238889,41.800278.json?access_token=pk.eyJ1IjoicmljY2FyZGFudGUiLCJhIjoiLUlVekRRYyJ9.ISPJ0xA1XnwnXtE9ibSbyw

// la posizione va presa dal GPS
var myPosizione = {"lat":"41.800278" , "lon" : "12.238889", "address":"impossibile ottenere la posizione"};

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


					 
					 




/*   CONTROLLER   */
function startApp(){
	  hideAll(["benvenuti"]);

}


/********* GET DATA FROM SERVER  *************/
function getUser(username){
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
}




/****  VIEW    ****/
function hideAll(appo){
  for(i=0;i<divs.length;i++){
	  if(divs[i]==appo[0]){
		$("#"+divs[i]).show();
	  }else{
		  $("#"+divs[i]).hide();
		}
  }
}


function showLoginForm(){
	hideAll(["login"]);
	//$("#login").show();
	/*
  document.getElementById("benvenuti").style.display = "none";  
  document.getElementById("login").style.display = "block";  
	showDrawerController();
	document.getElementById("loginForm").style.display = "block";
	document.getElementById("addtitle").innerHTML=" - LOGIN";
*/
}

function showHomeTheseus(){
  hideAll([""]);
  
  $("#loginError").html("");
  
	
  username = $("#signin-username").val();
  if(!getUser(username)){
	  return;
  }  

  
  var appo="<ul>";
  for(i=0;i<myTheseusItems.length ;i++){
    appo += '<li><h1 class="communicationTitle">';
    appo += myTheseusItems[i]["code"];
    appo += '</h1><p>';
    appo += '<div id="btn-theseus-'+i+'"><img src="'+myTheseusItems[i]['photo']+'" /></div>';
    appo += '</p></li>';
  }
  appo += '</ul>';
  $("#homeTheseus p").html(appo);
  $("#homeTheseus").show();
 
  for(j=0;j<myTheseusItems.length ;j++){
	$("#btn-theseus-"+j).bind("click", {msg:j}, showTheseusMap);
  }
  
  
}


function showTheseusMap(appo){
	id_theseus = appo.data.msg;
}





/*   ONLOAD  */
window.onload = function () {
  // aggiungo i listner	
  $("#benvenuti").bind("click", showLoginForm);
  $("#bFormSignIn").bind("click", showHomeTheseus);
  // LISTNER PARAMETRICO  $("#benvenuti").bind("click", VARIABILE, showLoginForm);

  
  startApp();
	$("#benvenuti").show(1);

};