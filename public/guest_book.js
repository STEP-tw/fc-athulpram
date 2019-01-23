const loadComments = function() {
  fetch("/guestbook")
    .then(function(response) {
      return response.json();
    })
    .then(function(comments) {
      console.log(comments);
      let htmlText = generateTableFor(comments.comments);
      document.getElementById("commentsList").innerHTML = htmlText;
    });
};

const generateTableFor = function(comments) {
  return (
    "<table><tr><th>Date</th><th>Name</th><th>Comment</th></tr>" +
    comments.reduce(
      (accumulator, comment) =>
        accumulator +
        "<tr><td>" +
        new Date(comment.date).toLocaleString() +
        "</td><td>" +
        comment.name +
        "</td><td>" +
        comment.comment +
        "</td></tr>",
      ""
    )
  );
};

const sentComments = function(event) {
  fetch("/guestbook", {
    method: "POST",
    body: JSON.stringify({
      name: document.cookie.split("=")[1],
      comment: document.getElementById("comment").value
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(comments) {
      let htmlText = generateTableFor(comments.comments);
      document.getElementById("commentsList").innerHTML = htmlText;
    });
};

const delete_cookie = function(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
window.onload = () => {
  loadComments();
};
