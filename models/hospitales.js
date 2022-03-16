const { Schema, model } = require('mongoose');


const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref: 'Usuario'    //Indica la relacion que hay 
    }
}, {collection:'hospilales'});


//Funcion qie hace que nos muestre los daots de los Users 
HospitalSchema.method('toJSON', function(){
    const {__v, ...object }=this.toObject()
    return object;
}) 

module.exports = model( 'Hospital', HospitalSchema ); //Exportamos el modelo de usuario para hacer CRUD


