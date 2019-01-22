const fs = require("fs");
const messageLog = "./src/data.json";
const plusToReplace = new RegExp(/\+/, "g");

const getGuestBook = (req, res, webData) => {
  console.log(webData);
  let htmlFile = generateTableFor(webData.comments);
  res.write(htmlFile);
  res.end();
};

const generateTableFor = function(comments) {
  return (
    "<table><tr><th>Date</th><th>Name</th><th>Comment</th></tr>" +
    comments.reduce(
      (accumulator, comment) =>
        accumulator +
        "<tr><td>" +
        comment.date.toLocaleString() +
        "</td><td>" +
        comment.name +
        "</td><td>" +
        comment.comment +
        "</td></tr>",
      ""
    )
  );
};

const addToGuestBook = function(comment, req, res, webData) {
  comments = webData.comments;
  comment["date"] = new Date();
  console.log(comment);
  comments.unshift(comment);
  getGuestBook(req, res, webData);
  fs.writeFile(messageLog, JSON.stringify(webData), err => {});
};

const addDataToBook = function(req, res, webData) {
  let contents = "";
  req.on("data", chunk => (contents += chunk));
  req.on("end", () => {
    console.log(contents);
    addToGuestBook(JSON.parse(contents), req, res, webData);
  });
};
module.exports = {
  getGuestBook,
  addDataToBook
};
