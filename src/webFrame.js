const fs = require("fs");
const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url && req.url != route.url) return false;
  return true;
};

class WebFrame {
  constructor(dataFile) {
    this.routes = [];
    fs.readFile(
      dataFile,
      function(err, content) {
        this.data = JSON.parse(content);
      }.bind(this)
    );
  }
  use(handler) {
    this.routes.push({ handler });
  }
  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }
  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }
  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(r => isMatching(req, r));
    let next = () => {
      let current = matchingRoutes[0];
      if (!current) return;
      matchingRoutes = matchingRoutes.slice(1);
      current.handler(req, res, this.data, next);
    };
    next();
  }
}
module.exports = WebFrame;
