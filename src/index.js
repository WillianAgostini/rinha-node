import http from "http";
import app from "./app.js";
import {
  insertPerson,
  findDocumentById,
  findDocumentByTerm,
} from "./router/person.js";
import { countPerson } from "./router/countPerson.js";
import { connectToDatabase } from "./db/db.js";
import { connectToCache } from "./db/cache.js";

const hostname = "127.0.0.1";
const port = 8080;

app.get("/pessoas", findDocumentByTerm);
app.get("/pessoas/[:id]", findDocumentById);
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

const main = async () => {
  await connectToDatabase("mongodb://127.0.0.1:27017");
  await connectToCache({
    host: "localhost", // Host do servidor Redis
    port: 6379, // Porta do servidor Redis (por padrão, 6379)
  });
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

main();
