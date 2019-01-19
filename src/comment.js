class Comment {
  contructor(name, comment) {
    this.name = name;
    this.comment = comment;
    this.time = new Date().toLocaleString();
  }
}

module.exports = Comment;
