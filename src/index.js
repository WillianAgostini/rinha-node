import http from "http";
import app from "./lib/app.js";
import {
  insertPerson,
  findDocumentById,
  findDocumentByTerm,
} from "./router/person.js";
import { countPerson } from "./router/countPerson.js";
import { connectToDatabase } from "./db/db.js";
import { connectToCache } from "./db/cache.js";

app.get("/pessoas", findDocumentByTerm);
app.get("/pessoas/:id", findDocumentById);
app.get("/contagem-pessoas", countPerson);
app.post("/pessoas", insertPerson);

const server = http.createServer(async (req, res) => {
  try {
    await app.executeEndpoint(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

const hostname = "127.0.0.1";
const port = 8080;
const main = async () => {
  await connectToDatabase(process.env.DB_URL || "mongodb://localhost:27017");
  await connectToCache({ url: process.env.REDIS_URL || "redis://localhost" });
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

main();
