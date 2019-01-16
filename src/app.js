const fs = require("fs");
const app = (req, res) => {
  try {
    provideData(req, res);
  } catch (err) {
    res.statusCode = 505;
    res.statusMessage = "An unexpected error occured";
    res.end();
  }
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
    res.end();
    return;
  }
  res.statusCode = 404;
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
