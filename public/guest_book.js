const loadComments = function() {
  fetch("/guest_book.html")
    .then(function(response) {
      return response.text();
    })
    .then(function(htmlFile) {
      let parser = new DOMParser();
      let newDoc = parser.parseFromString(htmlFile, "text/html");
      document.getElementById("commentsList").innerHTML = newDoc.getElementById(
        "commentsList"
      ).innerHTML;
    });
};
