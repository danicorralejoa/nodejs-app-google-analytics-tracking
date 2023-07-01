const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/users');
const User = require('../models/users');
const { param } = require('../routers/users');
const socketEvents = require('../socket')

//Funcion para Admin
const getAdmin =  (req, res)=>{
    jwt.verify(req.token, 'secret-key',(err, decoded)=>{
        if(err){
            res.send('No autorizado')
        } else{
            const filter = {};
            User.find(filter, (err,result)=>{
                if(err){
                    res.send('No se ha podido procesar la Base de Datos')
                } else{
                    res.render('all-users', {users:result})
                    //console.log({users:result})
        }
    })
        }
    })
};

//Registro
//Renderizar el HTML
const getRegister = (req,res)=>{
    res.render('register-users');
}

//Función para registrar a un usuario
const register =  (req, res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
//Revisar si el usuario ya existe
    User.findOne({email:req.body.email}, (err, result)=>{
        if(result){
            res.send("Usuario ya existe");
        } else{
            user.save((err, result)=>{
                if(err){
                    res.send('Se ha producido un error en el registro del usuario ' + err)
                }else{
                    //Socket
                    socketEvents.socketUserRegistered(req);
                    console.log(socketEvents.socketUserRegistered)
                    res.redirect('/');
                }
            })
        }
    });
};


//Eliminar usuario
//Renderizar HTML
const getDelete = (req, res)=>{
    const param = req.params.id;
    User.findById({_id: param}, (err,result)=>{
        if(err){
            console.log('Error al localizar al usuario ' + err)
        } else{
            console.log(result)
            res.render('delete-users', {users:result})
            
        }
    })
}

//Función para eliminar al usuario
const deleteUser =  (req, res)=>{
    const param = req.params.id;
    User.findByIdAndDelete({_id: param}, (err,result)=>{
        if(err){
            console.log('No se pudo borrar al usuario ' + err)
        } else{
            console.log('Usuario eliminado exitosamente');
            const io = req.app.get('io');
            io.on("connection", (socket) => {socket.emit('User Deleted Successfully', req.body.email);});
            res.redirect('/users/admin');
        }
    })
};

const getLogin =  (req, res)=>{
    res.render('login-users')
};


const login =  (req, res)=>{
    //const email = req.body.email;
    User.findOne({email:req.body.email}, (err,result)=>{
        if(err){
            console.log('No se ha podido encontrar al usuario');
        } else {
            if(result){
                if(bcrypt.compareSync(req.body.password, result.password)){
                    jwt.sign({users:result}, 'secret-key', (err, token)=>{
                        //console.log('Token creado: ' + token);
                        console.log('Usuario encontrado ' + result.id)
                        //res.append('Authorization', token);
                        //res.cookie('token', token, { secure: false })
                        //res.redirect(302,'http://localhost:3000/users/admin');
                        socketEvents.socketUserAuthenticated(req, result);
                        res.status(201).cookie('access_token', 'Bearer ' + token, 
                        {expires: new Date(Date.now() + 8 * 3600000)}) // cookie will be removed after 8 hours
                        .redirect(301, 'http://localhost:3000/users/admin')})
            } else {
                console.log('Contraseña Incorrecta');
                res.send('Contraseña Incorrecta');
            }
        }
    }
    })
};

module.exports = {getAdmin, getRegister, register, getDelete, deleteUser, getLogin,login};