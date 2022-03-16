
const mongoose = require('mongoose');

const dbConnection = async() =>{
    
    try{
    await mongoose.connect(process.env.DB_CNN); //Variable de entorno donde se encutra el enlce de mongoDB

    console.log("BD online")


    } catch(error){
        console.log(error);
        throw new Error("Error a la hora de iniciar la BD ver logs")
    }
}
//Exportamos la funcion dbConnection que es la encargada de llamar a la base de datos 
//Se exporta a index.js y se está exportando como un objeto 
module.exports = {
    dbConnection
}

