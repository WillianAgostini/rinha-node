import http from 'http';
import app from './app.js';
import { insertPerson } from './router/person.js'
import { connectDb } from './db/db.js';

const hostname = '127.0.0.1';
const port = 8080;

app.get('/pessoas/', (req, res) => {
    req.statusCode = 200;
    res.end('Ok');
});

app.get('/pessoas/[:id]', (req, res) => {
    req.statusCode = 200;
    res.end('Ok');
});

app.get('/contagem-pessoas', (req, res) => {
    req.statusCode = 200;
    res.end('Ok');
});

app.post('/pessoas', insertPerson);

const server = http.createServer(async (req, res) => {
    try {
        await app.executeEndpoint(req, res)
    } catch (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
});

server.listen(port, hostname, async () => {

    connectDb("mongodb://localhost:27017/rinha")
    console.log(`Server running at http://${hostname}:${port}/`);
});
