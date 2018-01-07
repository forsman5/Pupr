
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
  var el =   document.getElementById("heartIconDetail");
  var num =  document.getElementById("numLikes");
  var color = window.getComputedStyle(el,null).getPropertyValue('color');

  //187 == red
  if (color === "rgb(187, 0, 0)") {
      el.classList.add("unselectedHeart");
      el.classList.remove("selectedHeart");
      favorited = "unfavorite";
      num.innerHTML = parseInt(num.innerText) - 1;
  } else {
      el.classList.add("selectedHeart");
      el.classList.remove("unselectedHeart");
      num.innerHTML = parseInt(num.innerText) + 1;
      favorited = "favorite";
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

function redirect(){
  alert("You must confirm your account to favorite dogs");

  // $.get('/unverified',function(returnedData){

  // });
  // return false;

}

function deleteComment(selectedID, dogID){
  if(confirm('Are you sure you want to delete this comment?')){
    $.post('/deletecomment', { commentID: selectedID, dog: dogID}, function(returnedData){

    });

    //refresh the page, now without the comment
    document.location.reload();

    return true;
  }
}

function reportComment(commentID) {
  var userReason = prompt("Please give a short reason why this comment shouldn't be allowed on the site.", "");
  //if the user didn't cancel the submission
  if (!(userReason == null || userReason == "")) {

    $.post('/reportcomment', { commentID: commentID, reason: userReason}, function(returnedData){

    });

    alert("Comment reported! Thank you for helping to make Pupr a better site.");

    //refresh the page
    document.location.reload();

    return true;
  }
}
