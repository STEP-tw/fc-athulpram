const fs = require("fs");
const app = (req, res) => {
  try {
    provideData(req, res);
  } catch (err) {
    send(res, 505, "An unexpected error occured");
  }
};

const send = function(res, statusCode, statusMessage, contents) {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.write(contents);
  res.end();
};

const provideData = function(req, res) {
  let path = req.url;
  if (path.endsWith("/")) {
    path = path + "index.html";
  }
  path = "./public" + path;
  provideFileAsRes = provideFileContents.bind(this, res);
  fs.readFile(path, provideFileAsRes);
};

const provideFileContents = (res, err, contents) => {
  let statusCode = 200;
  let statusMessage = "Ok";
  if (err) {
    statusCode = 404;
    statusMessage = "Page Not Found";
    contents = "Oops Page Not Found!!!...";
  }
  send(res, statusCode, statusMessage, contents);
};

// Export a function that can act as a handler

module.exports = app;
