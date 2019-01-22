const loadComments = function() {
  fetch("/guestbook")
    .then(function(response) {
      return response.text();
    })
    .then(function(htmlText) {
      document.getElementById("commentsList").innerHTML = htmlText;
    });
};

const sentComments = function(event) {
  fetch("/guestbook", {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      comment: document.getElementById("comment").value
    })
  })
    .then(function(response) {
      return response.text();
    })
    .then(function(htmlText) {
      document.getElementById("commentsList").innerHTML = htmlText;
    });
};
window.onload = loadComments;
