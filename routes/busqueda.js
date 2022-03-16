const {Router } = require('express');
const  { getTodo,getDocumentosColeccion} =require ('../controllers/busqueda');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');


router.get( '/:busqueda',validarJWT,getTodo)

router.get( '/coleccion/:tabla/:busqueda',validarJWT,getDocumentosColeccion)


module.exports = router;