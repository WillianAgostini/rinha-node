import { count } from "../db/pessoas.js";

export async function countPerson(req, res) {
  const result = await count();
  res.statusCode = 200;
  return res.toJson({
    count: result,
  });
}
