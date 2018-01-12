/* This file should only be loaded on the admin page of the site, in order to
   not reveal the post / update endpoints to general users */

function dismissReport(commentID, reporterID) {
  $.post('/dismissReport', { commentID: commentID, reporterID: reporterID }, function(returnedData){

  });

  alert("Report removed.");

  //refresh the page
  document.location.reload();

  return true;
}

function deleteReportedComment(commentID, reporterID) {
  $.post('/deleteReportedComment', { commentID: commentID, reporterID: reporterID }, function(returnedData){

  });

  alert("Comment removed.");

  //refresh the page
  document.location.reload();

  return true;
}
