const express = require('express');
const socketEvents = require('../socket');


const getVideo = (req,res)=>{
    res.render('play-videos')
}

module.exports = {getVideo};