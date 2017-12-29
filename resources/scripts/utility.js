var check = function() {
  if (document.getElementById('password').value == document.getElementById('confirm_password').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Passwords match.';
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Passwords must match!';
  }
}

function checkPasswords() {
  if(document.getElementById('password').value == document.getElementById('confirm_password').value) {
    return true;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Passwords must match!';
    return false;
  }
}

function favoriteDog() {
  //this is to tell the server if the dog is already favorited.
  var favorited;

  //color change
  //document.write("clicked");
  var el =   document.getElementById("heartIconDetail");
  var style = window.getComputedStyle(el,null);
  var color = style.getPropertyValue('color');
  if (color === "rgb(187, 0, 0)") {
      el.style.color = "rgb(128,128,128)";
      favorited = false;
  } else {
      el.style.color = "rgb(187,0,0)";
      favorited = true;
  }

  //send http req
  //get params
  var dogFromPage = window.location.pathname.substring(6); // just dog id, not anything else

  $.post('/favoriteDog', { dog: dogFromPage, currentState: favorited }, function(returnedData){
    // TODO
    // could this be it?
    //res.send(returnedData);
  });

  return false;
}
