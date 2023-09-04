// POST /pessoas
// GET /pessoas/[:id]
// GET /pessoas?t=[:termo da busca]
// GET /contagem-pessoas
const getEndpoints = {};
const postEndpoints = {};

function newGetRoute(endpoint, fn) {
  getEndpoints[endpoint] = fn;
}

function newPostRoute(endpoint, fn) {
  postEndpoints[endpoint] = fn;
}

function json() {
  const req = this;
  return new Promise((resolve, reject) => {
    let body = [];
    req
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        const json = JSON.parse(body);
        resolve(json);
      });
  });
}

function toJson(document) {
  const res = this;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(document));
}

async function executeEndpoint(req, res) {
  res.toJson = toJson;
  req.json = json;
  const { method, url } = req;
  let fn;
  let _url = url;
  if (method == "GET") {
    _url = url.replace(/\?t=.*$/, "");
    _url = _url.replace(/\/pessoas\/\w+/, "/pessoas/[:id]");
    fn = getEndpoints[_url];
  }
  if (method == "POST") {
    fn = postEndpoints[_url];
  }

  return await fn(req, res);
}

export default {
  get: newGetRoute,
  post: newPostRoute,
  executeEndpoint: executeEndpoint,
};
