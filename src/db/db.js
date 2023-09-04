import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.

export let client, database, person;

export function connectDb(uri) {
    client = new MongoClient(uri);
    database = client.db("insertDB");
    person = database.collection("pessoas");
}
