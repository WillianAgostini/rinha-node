import { insert, findById, findByTerm } from "../db/pessoas.js";

function validateDocument(document) {
  if (!document.apelido) throw new Error("Apelido is required");

  if (document.apelido.length > 32)
    throw new Error("Apelido must be less than 32 characters");

  if (!document.nome) throw new Error("Nome is required");

  if (typeof document.nome !== "string")
    throw new Error("Nome must be a string");

  if (!document.nascimento) throw new Error("Nascimento is required");
}

export async function insertPerson(req, res) {
  try {
    const body = await req.json();
    validateDocument(body);
    await insert(body);
    res.statusCode = 201;
    res.end();
  } catch (err) {
    res.statusCode = 400;
    res.end();
  }
}

export async function findDocumentById(req, res) {
  const id = req.url.replace("/pessoas/", "");
  const document = await findById(id);
  if (document) {
    res.statusCode = 200;
    return res.toJson(document);
  }

  res.statusCode = 404;
  res.end();
}

export async function findDocumentByTerm(req, res) {
  const term = req.url.replace("/pessoas?t=", "");
  const documents = await findByTerm(term);
  res.statusCode = 200;
  return res.toJson(documents);
}
