const fs = require("fs");
const WebFrame = require("./webFrame.js");
const { getGuestBook, addDataToBook } = require("./guest_book.js");
const app = new WebFrame("./src/data.json");

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
app.get("/guest_book.html", getGuestBook);
app.post("/guest_book.html", addDataToBook);
app.use(provideData);

module.exports = app.handleRequest.bind(app);
