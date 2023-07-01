const express = require('express');
const app = express();
const path = require('path');
require('./connections')
const socketio = require('socket.io');
const http = require('http');
const userRouters = require('./routers/users');
const videoRouters = require('./routers/videos');
const cookieParser = require("cookie-parser");



//Configuración del servidor
//Definimos el puerto de escucha
const port = 3000;
app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Denifimos que no decodifique la URL
app.use(express.urlencoded({extended: false}));


//Accediendo a los archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//Usar lector de cookies
app.use(cookieParser());

//Rutas
app.get('/', (req,res)=>{
    console.log('Cookies: ', req.cookies.access_token);
    res.render('index');
})
const server = http.createServer(app);
const io = socketio(server);
app.set('io', io);
//require('./socket')(io);

//Usar las rutas para el manejo de usuarios
app.use('/users', userRouters);
app.use('/videos', videoRouters);


server.listen(app.get('port'), ()=>{
    console.log('Escuchando servidor en puerto ' + app.get('port'))
});