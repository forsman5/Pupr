var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs'); //file system

console.log("Server starting...");

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);

  //resource to access
  var filename;

  //determine if it is a resources req
  if (q.pathname.indexOf("resources") != -1) {
    filename = "." + q.pathname;
  } else {
    filename = "./Views" + q.pathname + ".html";
  }

  //routing blank to index
  if (filename == "./Views/") {
    filename = "./Views/index.html";
  }

  var extname = path.extname(filename);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}

  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': contentType});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
    return res.end();
  });
}).listen(8080);
