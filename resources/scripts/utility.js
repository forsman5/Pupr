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
function colorChange() {
  document.write("clicked");
    var background = document.getElementById("heartIconDetail").style.color;
    if (background == "#BB0000") {
        document.getElementById("heartIconDetail").style.color = "grey";
    } else {
        document.getElementById("heartIconDetail").style.color = "#BB0000";
    }

}
