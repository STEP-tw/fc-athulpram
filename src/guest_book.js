const fs = require("fs");
const messageLog = "./private/data.json";
const plusToReplace = new RegExp(/\+/, "g");
const COMMENT_FORM = `<form action="/logout" method="POST">Name : __NameIsHere__<input type="submit" value="Logout"/></form><br /><br />
        Comment : <textarea name="comment" id="comment"></textarea><br /><br />
        <button onclick="sentComments()">Submit</button>`;

const LOGIN_FORM = `<form action="/login" method="POST">
        Name : <input type="text" name = "name" id="name" />
        <input type="submit" value="Login"/>
        </form>`;

const GUEST_BOOK_HTML = fs.readFileSync("./public/guest_book.html", "utf-8");

const getGuestBook = (req, res, webData) => {
  res.write(JSON.stringify(webData));
  res.end();
};

const addToGuestBook = function(comment, req, res, webData) {
  comments = webData.comments;
  comment["date"] = new Date();
  comments.unshift(comment);
  getGuestBook(req, res, webData);
  fs.writeFile(messageLog, JSON.stringify(webData), err => {});
};

const addDataToBook = function(req, res, webData) {
  let contents = "";
  req.on("data", chunk => (contents += chunk));
  req.on("end", () => {
    addToGuestBook(JSON.parse(contents), req, res, webData);
  });
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

let loggedUsers = [];

const logUserIn = function(req, res) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    let username = parseData(content).name;
    if (loggedUsers.includes(username)) {
      loggedUsers.push(username);
    }
    res.setHeader("Set-Cookie", `username=${username}`);
    res.statusCode = 302;
    res.setHeader("location", "/guest_book.html");
    res.end();
  });
};

const provideGuestBook = function(req, res) {
  let cookie = req.headers.cookie;
  let htmlFile;
  let username = "";
  if (cookie) {
    username = cookie.split("=")[1];
    htmlFile = generateHTML(GUEST_BOOK_HTML, COMMENT_FORM, username);
  } else {
    htmlFile = generateHTML(GUEST_BOOK_HTML, LOGIN_FORM);
  }
  res.write(htmlFile);
  res.end();
};

const generateHTML = function(data, form, username) {
  if (username) {
    return data.replace(
      "__FormIsHere__",
      form.replace("__NameIsHere__", username)
    );
  }
  return data.replace("__FormIsHere__", LOGIN_FORM);
};

const logUserOut = function(req, res) {
  res.setHeader(
    "Set-Cookie",
    `username =null;expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  );
  res.statusCode = 302;
  res.setHeader("location", "/guest_book.html");
  res.end();
};

module.exports = {
  getGuestBook,
  addDataToBook,
  logUserIn,
  provideGuestBook,
  logUserOut
};
