const verifyToken = (req, res, next)=>{
    const authorization = req.cookies.access_token;
    if(authorization != undefined){
        const token = authorization.split(" ")[1];
        req.token = token;
        //console.log(token);
        next();
    } else{
        console.log('No se encuentra token');
        res.send('Token no encontrado ' + authorization);
    }
}

exports.verifyToken = verifyToken