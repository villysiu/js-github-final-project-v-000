describe('GithubInteractor constructor function', function(){
  it('creates a GithubInteractor object', function(){
      var interactor = new GithubInteractor("wasdfwasd");
      expect(interactor.token).toEqual("wasdfwasd");
  });
});

describe('#createIssue', function() {
  beforeEach(function(){
    setFixtures('<body><form>Repository Name:<input type="text" id="repoName">Repository Owner:<input type="text" id="repoOwner">Issue Title:<input type="text" id="title">Issue Body:<input type="text" id="body"><input type="submit" value="submit"></form><div id="issue"></div></body>')
  });
  it('calls the github api with a post', function() {
    spyOn($, "ajax").and.callFake(function (req) {
        var d = $.Deferred();
        d.reject({});
        return d.promise();
      });
    var repoName = "temp";
    var repoOwner = "blake41";
    createIssue(repoName,repoOwner , "BIG ISSUE", "the biggest issue ever");
    expect($.ajax.calls.argsFor(0)[0].url).toEqual('https://api.github.com/repos/' + repoOwner + '/' + repoName + '/issues');
    expect($.ajax.calls.argsFor(0)[0].type).toEqual('POST');
  });

  it('sends the correct data', function() {
    expectedData = {
      'title':   "BIG ISSUE",
      'body': 'the biggest issue ever!!',
    }
    spyOn(JSON, 'stringify');
    var repoName = "temp";
    var repoOwner = "blake41";
    createIssue(repoName, repoOwner, "BIG ISSUE", "the biggest issue ever!!");
    expect(JSON.stringify.calls.argsFor(0)[0]).toEqual(expectedData);
  });
 });

describe('handleResponse', function(){
  beforeEach(function(){
    setFixtures('<body><div id="issue"></div></body>')
  });
  it('renders the issue link on the page', function(){
    handleResponse({
        "html_url": 'https://github.com/username/reponame/issue/12',
        "title": "BIG ISSUE",
        "body": "the biggest issue ever!!"
      })
    expect($('#issue').text()).toEqual("BIG ISSUE");
  });
});

describe('handleResponse', function(){
  it("handleResponse callback function is called", function() {
    jasmine.Ajax.withMock(function() {
      spyOn(window, "handleResponse")
      expect(window.handleResponse).not.toHaveBeenCalled();
      createIssue("temp", "blake41", "BIG ISSUE", "the biggest issue ever!!");
      var data = {
        "html_url": 'someurl',
        "title": "BIG ISSUE",
        "body": "the biggest issue ever!!"
      }
      var response = {
        "status": 200,
        "contentType": 'application/json',
        "responseText" : JSON.stringify(data)
      }
      jasmine.Ajax.requests.mostRecent().respondWith(response);
      expect(window.handleResponse).toHaveBeenCalled();
    });
  });
})

describe('handleError', function(){
  it("handleError callback function is called", function() {
    jasmine.Ajax.withMock(function() {
      spyOn(window, "handleError")
      expect(window.handleError).not.toHaveBeenCalled();
      createIssue("temp", "blake41", "BIG ISSUE", "the biggest issue ever!!");
      var response = {
        "status": 401,
        "contentType": 'text/plain',
        "responseText" : "unauth",
        "statusText": "Unathorized"
      }
      jasmine.Ajax.requests.mostRecent().respondWith(response);
      expect(window.handleError).toHaveBeenCalled();
    });
  });
})

describe('handleError', function(){
  it("logs error to the console", function() {
    console.log = jasmine.createSpy("log");
    var errorThrown = "Unauthorized";
    var textStatus = "error"
    var jqXHR = {}
    handleError(jqXHR, textStatus, errorThrown)
    expect(console.log).toHaveBeenCalledWith("Post error: " + errorThrown);
  });
})
