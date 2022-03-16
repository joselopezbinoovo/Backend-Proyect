const Usuario = require("../models/usuario"); //Exportacion de la clase
const { response } = require("express");
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {

  const desde = Number(req.query.desde) || 0 ; //Paginador 

   const [usuarios,total] = await Promise.all([   //Coleecion de promesas (Promise.all) ejecuta todas las pormesas de manera silultanea
    Usuario
    .find({}, "nombre email role google")
    .skip ( desde) //El skip sirve para que cuando selecciones desde el 5 te sace del 5 hasta el ultimo
    .limit(5), //Establece el limite de campos que aparecen 
    Usuario.count() // cuenta la cantidad de registros     

    ])
  res.json({
    ok: true,
    usuarios,
    total
  });
};

const crearUsuarios = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existEmail = await Usuario.findOne({ email }); //Valida si existe el email

    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body); //Instacia de la clase con las propiedades

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar usuario
    await usuario.save();

    //Crea token 
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const updateUser = async (req, res = response) => {
  const uid = req.params.id; //Estamos recogiendo la id del usuario

  try {
    const usuarioBD = await Usuario.findById(uid); //Sirve para buscar el usuario

    if (!usuarioBD) {
      return res.status(404).json({
        ok: false,
        msg: "No se encuentra id ",
      });
    }

    //Actualizar
    const { password, google, email, ...campos } = req.body;

    if (usuarioBD.email !== email) {
      //Si el usuaio no esta acutalizando el email lo podems borrar
      const exixteEmail = await Usuario.findOne({ email });
      if (exixteEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }
    campos.email = email;

    const UsuarioUpdate = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: UsuarioUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioBD = await Usuario.findById(uid); //Sirve para buscar el usuario

    if (!usuarioBD) {
      return res.status(404).json({
        ok: false,
        msg: "No se encuentra id ",
      });
    }
    await Usuario.findByIdAndDelete ( uid);



    res.json({
      ok: true,
      uid,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  updateUser,
  borrarUsuario,
};
