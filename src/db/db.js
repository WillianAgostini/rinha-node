import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.

const dbName = "rinha";

export let db;

export async function connectToDatabase(url) {
  if (!db) {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    await getCollection().createIndex({ term: "text" });
    await getCollection().createIndex({ apelido: 1 }, { unique: true });
  }
  return db;
}

export function getCollection() {
  return db.collection("pessoas");
}
