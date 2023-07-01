const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creamos el Schema del usuario
const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});

//Guardamos el modelo del usuario que vamos a exportar para usarlo en controllers
const User = mongoose.model('User', userSchema);

module.exports = User;