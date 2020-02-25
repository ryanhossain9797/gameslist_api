const http = require('http');
const app = require('./app');

const port = process.env.port || 3693;

const server = http.createServer(app);

server.listen(port, function() {
    console.log("listening on port " + port);
});