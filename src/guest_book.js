const fs = require("fs");
const messageLog = "./src/comments.json";
const getGuestBook = (req, res) => {
  fs.readFile(messageLog, (err, contents) => {
    let comments = JSON.parse(contents).comments;
    let htmlFile = `<!DOCTYPE html>
<html>
  <head>
    <title>Guest Book</title>
  </head>
  <body>
    <header class="header"><a href=""><<</a>Guest Book</header>
    <div id="main">
      <form action="/guest_book.html" method="post">
        Name : <input type="text" name="name" /><br />
        Comment : <textarea name="comment"></textarea></br>
         <input type="submit" />
      </form>
    </div>
       
    <div>
    <table><tr><th>Date</th><th>Name</th>
    ${generateTableFor(comments)}
    </div>
  </body>
</html>
`;
    res.write(htmlFile);
    res.end();
  });
};

const generateTableFor = function(comments) {
  return comments.reduce(
    (accumulator, comment) =>
      accumulator +
      "<tr><td>" +
      comment.date +
      "</td><td>" +
      comment.name +
      "</td><td>" +
      comment.comment +
      "</td></tr>",
    ""
  );
};

const parseData = function(data) {
  let dataObj = {};
  data = data.split("&");
  data.map(function(arg) {
    let [key, value] = arg.split("=");
    dataObj[key] = value;
  });
  return dataObj;
};

const addToGuestBook = function(comment, req, res) {
  comment = parseData(comment);
  fs.readFile(messageLog, (err, contents) => {
    let jsonFile = JSON.parse(contents);
    let comments = jsonFile.comments;
    comments.push(comment);
    fs.writeFile(messageLog, JSON.stringify(jsonFile), err => {
      getGuestBook(req, res);
    });
  });
};

const addDataToBook = function(req, res) {
  let contents = "";
  req.on("data", chunk => (contents += chunk));
  req.on("end", () => {
    addToGuestBook(contents, req, res);
  });
};
module.exports = {
  getGuestBook,
  addDataToBook
};
