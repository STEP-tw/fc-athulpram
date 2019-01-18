const fs = require("fs");
const messageLog = "./src/comments.json";
const getGuestBook = (req, res) => {
  fs.readFile(messageLog, (err, contents) => {
    let comments = JSON.parse(contents).comments;
    let htmlFile = `<!DOCTYPE html>
<html>
  <head>
    <title>Guest Book</title>
    <link rel="stylesheet" href="/resources/styles/main.css" />    
  </head>
  <body>
    <header class="centeredHeader"><h1><a href="/index.html"><<</a>Guest Book</h1></header>
    <div id="main">
      <form action="/guest_book.html" method="post" class="form">
        Name : <input type="text" name="name" /><br /><br/>
        Comment : <textarea name="comment"></textarea><br/><br/>
         <input type="submit" value="submit" class="msgSubmit"/>
      </form>
    </div>
       
    <div class="commentsList">
    <table><tr><th>Date</th><th>Name</th><th>Comment</th></tr>
    ${generateTableFor(comments)}
    </table>
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
    comment.date = new Date().toLocaleString();
    comments.unshift(comment);
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
