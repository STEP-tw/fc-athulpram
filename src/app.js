const fs = require("fs");
const app = (req, res) => {
  try {
    provideData(req, res);
  } catch (err) {
    send(res, 505, "An unexpected error occured");
  }
};

const send = function(res, statusCode = 200, statusMessage = "Ok") {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.end();
};

const provideData = function(req, res) {
  let path = req.url;
  if (path.endsWith("/")) {
    path = path + "index.html";
  }
  path = "./pages" + path;
  provideFileAsRes = provideFileContents.bind(this, res);
  fs.readFile(path, provideFileAsRes);
};

const provideFileContents = (res, err, contents) => {
  if (err == null) {
    res.write(contents);
    send(res);
    return;
  }
  send(res, 404, "File Not Found");
};

// Export a function that can act as a handler

module.exports = app;
