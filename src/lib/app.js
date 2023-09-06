import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { bodyToJson } from "./request.js";
import { responseToJson } from "./response.js";
import { RouterTree } from "./routerTree.js";

const routeTreeGet = new RouterTree();
const routeTreePost = new RouterTree();
const routeTreePut = new RouterTree();
const routeTreePatch = new RouterTree();
const routeTreeDelete = new RouterTree();

const newGetRoute = (endpoint, fn) => routeTreeGet.addRoute(endpoint, fn);
const newPostRoute = (endpoint, fn) => routeTreePost.addRoute(endpoint, fn);
const newPutRoute = (endpoint, fn) => routeTreePut.addRoute(endpoint, fn);
const newPatchRoute = (endpoint, fn) => routeTreePatch.addRoute(endpoint, fn);
const newDeleteRoute = (endpoint, fn) => routeTreeDelete.addRoute(endpoint, fn);

async function execute(req, res) {
  res.toJson = responseToJson;
  req.json = bodyToJson;

  const routeInfo = await getRouteBy(req.url, req.method);
  if (routeInfo) {
    req.params = routeInfo.params;
    req.searchParams = routeInfo.searchParams;
    return await routeInfo.handler(req, res);
  }

  res.statusCode = 404;
  res.end("Not Found");
}

async function getRouteBy(path, method) {
  if (method === "GET") return routeTreeGet.findRoute(path);

  if (method === "POST") return routeTreePost.findRoute(path);

  if (method === "PUT") return routeTreePut.findRoute(path);

  if (method === "PATCH") return routeTreePatch.findRoute(path);

  if (method === "DELETE") return routeTreeDelete.findRoute(path);

  return;
}

const startWithCluster = async (handler) => {
  const numCPUs = availableParallelism();

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    await handler();
    console.log(`Worker ${process.pid} started`);
  }
};

export default {
  get: newGetRoute,
  post: newPostRoute,
  put: newPutRoute,
  patch: newPatchRoute,
  delete: newDeleteRoute,
  execute,
  startWithCluster,
};
