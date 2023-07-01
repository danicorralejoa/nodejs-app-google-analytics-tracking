const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const verifyToken = require('../middleware/verifyToken');

router.get('/admin', verifyToken.verifyToken, userController.getAdmin);
router.get('/register', userController.getRegister);
router.get('/delete/:id', userController.getDelete);
router.get('/login', userController.getLogin);

router.post('/register', userController.register);
//routes.post('/update')
router.post('/delete/:id', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router