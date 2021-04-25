const express = require('express');
const app = express();
const expressWS = require('express-ws')(app);
const path = require('path');
const wsController = require('./controllers/ws-controller')

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'./views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res) => {
    res.render('index')
})

app.ws('/chat', wsController)

const port = 3000;
app.listen(port,() => console.log(`App escuchando en el puerto ${port}`))



