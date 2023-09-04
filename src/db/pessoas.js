import { person } from './db.js';

export async function insert(doc) {
    try {
        const result = await person.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err)
    }
};