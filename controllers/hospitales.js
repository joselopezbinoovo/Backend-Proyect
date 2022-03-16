const { response } = require("express")
const Hospital = require("../models/hospitales");


const getHospitales = async(req,res=response) => {

    const hospilales = await Hospital.find() //Haciendo esto podemos ver quien es el creador del hospital 
                            .populate('usuario','nombre img');

    res.json({
        ok:true,
        hospilales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({ 
       usuario:uid,
        ...req.body 
    });

    try {
        
        const hospitalDB = await hospital.save();
        

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    


}




const updateHospital = async (req,res=response) => {

    const id = req.params.id;   //Recogemos la id que se encuentra en le request 
    const uid = req.uid;    //Tenemos acceso a la id porque pasa por el JWT 
    try{
        const hospital = await Hospital.findById(id)

        if ( !hospital){
            return res.status(404).json({
                ok:true,
                msg:'Hospital no encontrado ',
                id
            })
        }

        const cambiosHospital = { //Objeto donde se cambian los datos del hosptial 
            ...req.body,
            usuario: uid   //Sirve para mostar el id del usuario que lo esta cambiando

        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambiosHospital,{new: true});
       // {new: true} REGRESA EL ULTIMO CAMBIO ACTUALIZADO 
        res.json({
            ok:true,
            msg:'updateHospital',
            hospital:hospitalActualizado
        })

    }catch (error){
        res.status(500).json({
            ok:false,
            msg:"hable con el admin"
        })
    }
}


const deleteHospital = async (req,res=response) => {

    const id = req.params.id;   //Recogemos la id que se encuentra en le request 

    try{
        const hospital = await Hospital.findById(id)

        if ( !hospital){
            return res.status(404).json({
                ok:true,
                msg:'Hospital no encontrado ',
                id
            })
        }

    await Hospital.findByIdAndDelete(id);
    
        res.json({
            ok:true,
            msg:'Hospital eliminado'
        })

    }catch (error){
        res.status(500).json({
            ok:false,
            msg:"hable con el admin"
        })
    }
}



module.exports = {
    getHospitales,crearHospital,updateHospital,deleteHospital
}