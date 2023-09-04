import { insert } from '../db/pessoas.js';

export async function insertPerson(req, res) {
    const body = await req.json(); 
    console.log(body)
    req.statusCode = 200;
    res.end('Ok');
}