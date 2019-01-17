const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url && req.url != route.url) return false;
  return true;
};

class WebFrame {
  constructor() {
    this.routes = [];
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
      current.handler(req, res, next);
    };
    next();
  }
}
module.exports = WebFrame;
