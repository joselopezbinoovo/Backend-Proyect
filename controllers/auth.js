const bcrypt = require("bcryptjs/dist/bcrypt");

const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const Usuario = require ('../models/usuario');
const usuario = require("../models/usuario");

const login = async (req, res = response) => {
 
    const { email, password } = req.body;
 
    try {

        //Verificar Email
        const usuarioDb = await Usuario.findOne({ email }) //Buscar usuario por el email 

        if ( !usuarioDb ){  //Si no se encuentra...
            return res.status(404).json({
                ok:false,
                msg:'Email no valido '
            })
        }

        //Verificar contraseña 

const validPaswword = bcrypt.compareSync(password, usuarioDb.password);    //CompaereSync es una funcion que sirve para comparar
//En nuestro caso esta comparano la contraseña que estasmos intridcuioedo (password) con la que contiene el usuario (usuarioDb)
if ( !validPaswword){
    return res.status(404).json({
        ok:false,
        msg:'Contraseña no valida '
    })
}

//Generar el TOKEN

const token = await generarJWT(usuarioDb.id);



    res.json({
    ok:true,
    token
})
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};


const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario Se vuelve a autenticar el usuario si ya existe
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
}

const renewToken = async ( req,res = response) =>{ //Funcion que crea un nuveo token a un usuario si este ya ha expirado es decir nos renueva el token 

    const uid = req.uid  //Id del usuario 

    const token = await generarJWT( uid)

    res.json({
        ok:true,
        token
    })
}
module.exports = {
    login ,
    googleSignIn,
    renewToken
}