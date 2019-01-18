const fs = require("fs");
const messageLog = "./src/data.json";
const htmlFirstHalf = `<!DOCTYPE html>
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
    <table><tr><th>Date</th><th>Name</th><th>Comment</th></tr>`;

const htmlSecondHalf = `</table>
    </div>
  </body>
</html>
`;

const getGuestBook = (req, res, webData) => {
  let htmlFile =
    htmlFirstHalf + generateTableFor(webData.comments) + htmlSecondHalf;
  res.write(htmlFile);
  res.end();
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

const addToGuestBook = function(comment, req, res, webData) {
  comments = webData.comments;
  comment = parseData(comment);
  comment.date = new Date().toLocaleString();
  comments.unshift(comment);
  getGuestBook(req, res, webData);
  fs.writeFile(messageLog, JSON.stringify(webData), err => {});
};

const addDataToBook = function(req, res, webData) {
  let contents = "";
  req.on("data", chunk => (contents += chunk));
  req.on("end", () => {
    addToGuestBook(contents, req, res, webData);
  });
};
module.exports = {
  getGuestBook,
  addDataToBook
};
