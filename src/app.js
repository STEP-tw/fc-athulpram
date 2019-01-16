const fs = require("fs");
const app = (req, res) => {
  let path = req.url;
  if (path == "/") {
    path = "/index.html";
  }
  path = "." + path;
  provideFileAsRes = provideFileContents.bind(this, res, path);
  fs.exists(path, provideFileAsRes);
};

const provideFileContents = function(res, filePath, exists) {
  if (exists) {
    fs.readFile(filePath, (err,contents) => {
      console.log(contents);

      res.write(contents.toString());
      res.end();
    });
    return;
  }
  res.statusCode = 404;
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
