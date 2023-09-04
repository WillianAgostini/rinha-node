import { getCollection } from "./db.js";
import { ObjectId } from "mongodb";
import { cache } from "./cache.js";

export async function insert(doc) {
  const id = await cache.get(doc.apelido);
  if (id) {
    throw new Error("Apelido already exists");
  }

  const stack = doc.stack?.join(" ");
  doc.term = `${doc.apelido} ${doc.nome} ${doc.nascimento} ${stack}`;
  const result = await getCollection().insertOne(doc);
  await cache.set(doc.apelido, String(result.insertedId));
}

export async function findById(id) {
  const query = { _id: new ObjectId(id) };
  return await getCollection().findOne(query);
}

export async function findByTerm(text) {
  const query = { $text: { $search: text } };
  return await getCollection().find(query).limit(50).toArray();
}

export async function count() {
  return await getCollection().countDocuments();
}
