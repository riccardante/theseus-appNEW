


function showLoginForm(){
  document.getElementById("benvenuti").style.display = "none";  
  document.getElementById("login").style.display = "block";  
}


window.onload = function () {
  // aggiungo i listner	
  document.getElementById("benvenuti").addEventListener("click", showLoginForm);

  //document.getElementById("login").addEventListener("click", showLoginForm);
  document.getElementById("login").style.display = "none";  

  }