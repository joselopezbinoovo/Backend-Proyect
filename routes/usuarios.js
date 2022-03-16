/* 
Ruta: /api/usuarios
*/

const {Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const  { getUsuarios, crearUsuarios, updateUser,borrarUsuario } =require ('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();



router.get( '/',validarJWT ,getUsuarios)
router.post( '/',
    [
        validarJWT,
        check('nombre',"El nombre es obligatiorio").not().isEmpty(), //Validacion de que no este vacio 
        check('password', 'El passoword el obliglatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
crearUsuarios);

router.put ( '/:id',
[
    validarJWT,
    check('nombre',"El nombre es obligatiorio").not().isEmpty(), //Validacion de que no este vacio 
    check('password', 'El passoword el obliglatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
],
 updateUser )

router.delete ( '/:id',validarJWT,borrarUsuario);



module.exports = router;