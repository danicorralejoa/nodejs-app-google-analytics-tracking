/*module.exports = (io)=>{
    io.on('connection', (socket)=>{
        console.log('Un usuario se ha conectado');
        socket.on('disconnect',()=>{
            console.log('El usuario se ha desconectado');   
        })
    }) 
}*/

//Hash Module
const { createHash } = require('node:crypto');
const hash = createHash('sha256');

const socketUserRegistered = (request)=>{
    const io = request.app.get('io');
    const user_email = hash.update(request.body.email).digest('hex');
    io.on("connection", (socket) => {
        socket.emit('User Registered Successfully', user_email);
        console.log(socket.id)});
}

const socketUserAuthenticated = (request, results)=>{
    const io = request.app.get('io');
    const user_email = hash.update(request.body.email).digest('hex');
    io.on("connection", (socket) => {
            socket.emit('User Authenticated Successfully', user_email, results.id);
            console.log('User Authenticated Successfully ' + user_email + ' ' + results.id);
            console.log('socket.id is: ' + socket.id);
    });
}

module.exports = {socketUserRegistered, socketUserAuthenticated}