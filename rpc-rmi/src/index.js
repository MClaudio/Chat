const express = require('express');
const app = express();
const expressWS = require('express-ws')(app);
const path = require('path');

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'./views'));

app.get('/',(req,res) => {
    res.render('index')
})

app.ws('/chat',(ws,req) =>{
    ws.on('message',(msg) =>{
        console.log(msg);

        ws.send('respuesta de prueba');
    })
})

const port = 3000;
app.listen(port,() => console.log(`App escuchando en el puerto ${port}`))