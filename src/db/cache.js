import { createClient } from "redis";

export let cache;

export async function connectToCache(connection) {
  cache = createClient(connection);
  await cache.connect();
}
