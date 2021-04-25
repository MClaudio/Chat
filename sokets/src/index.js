const express = require('express');
const path = require('path');
const socket = require('socket.io')

const app = express();
app.set('port', process.env.PORT || 1000);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('listening on *:1000');
});

//config websockets
const io = socket(server);
io.on('connection', (soket)=>{
    console.log("New conection");
    soket.on('chat:message', (data)=>{
        //console.log("message", data)
        soket.broadcast.emit('chat:message', data)
    });

    soket.on('chat:typing', (data)=>{
        //console.log("message", data)
        soket.broadcast.emit('chat:typing', data)
    });


})