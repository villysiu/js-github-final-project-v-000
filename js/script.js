'use strict';


function GithubInteractor(token) {
  this.token = token;
}


function createIssue(repoName, repoOwner, title, body){
  var someToken;
  var interactor = new GithubInteractor(someToken);
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/issues";
  var data = {
    title: title,
    body: body
  };

  $.ajax({
    url: url,
    type: 'POST',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "token " + interactor.token);
    },
    data: JSON.stringify(data)

  })
  .done(handleResponse)
  .fail(handleError);
}
function handleResponse(data) {
  var issue = new Issue(data.html_url, data.title, data.body);
  issue.outhtml();
}

function Issue(url, title, body) {
  this.url = url;
  this.title = title;
  this.body = body;
  this.outhtml = function(){
    $('#issue').html('<a href="' + this.url +'">' + this.title + '</a><br>')
  }
}
function handleError(xhr, status, error) {
  $('#issue').html("Post error: " + error)
}

$(document).ready(function(){

  $("form").on('submit', function(e){
    var repoName = $("#repoName").val();
    var repoOwner = $("#repoOwner").val();
    var title = $("#title").val();
    var body = $("#body").val();

    createIssue(repoName, repoOwner, title, body);
    e.preventDefault();
  });
})
