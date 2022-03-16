const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Funcion qie hace que nos muestre los daots de los Users 
UsuarioSchema.method('toJSON', function(){
    const {__v, __id,password, ...object }=this.toObject()
    object.uid = __id;
    return object;
}) 

module.exports = model( 'Usuario', UsuarioSchema ); //Exportamos el modelo de usuario para hacer CRUD