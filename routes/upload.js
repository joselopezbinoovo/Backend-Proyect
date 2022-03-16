/*
const {Router } = require('express');
const  { fileUpload } =require ('../controllers/upload');
const { validarJWT } = require('../middlewares/validar-jwt');

const expresFileUpload = require('express-fileupload');
const router = Router();

router.use(expresFileUpload());

router.put( '/:tipo/:id',validarJWT,fileUpload)


module.exports = router; */