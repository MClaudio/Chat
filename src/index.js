const express = require('express');

const app = express();
var http = require('http').createServer(app);






http.listen(5000, () => {
    console.log('listening on *:5000');
});