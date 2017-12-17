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
    filename = "./Views" + q.pathname;
  }

  //routing blank to index
  if (filename == "./Views/") {
    filename = "./Views/index";
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
    case '':
      //no ext -- misses .png and etc this way
      //content remains html
      filename = filename + ".html";
      break;
	}

  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(404, {'Content-Type': contentType});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
    return res.end();
  });
}).listen(8080);
