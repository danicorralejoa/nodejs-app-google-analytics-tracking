const mongoose = require('mongoose');
const { mongodb } = require('./config');

const connection = mongoose.connect(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`)
.then((db)=>{
    console.log('Conexión a la base de datos fue exitosa');
}).catch((err)=>{
    console.log('Se ha producido un error de conextion ' + err);
})

module.exports = connection

/* Como conectarse a la BD Mongo para revisar creacion de usuario
1- En nueva terminal "mongod"
2- Invocar mongosh
3- use database_name for example, use jwtdb
4- db.users.find()*/