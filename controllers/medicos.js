const { response } = require("express")
const Medico = require('../models/medicos');

const getMedicos = async(req,res=response) => {

    const medicos = await Medico.find()  //Obetenos su usuarioi que lo ha creado y el hospital al que pertenece 
                        .populate("usuario",'nombre img')
                        .populate("hospital",'nombre img')
    res.json({
        ok:true,
        medicos
    })
}

const crearMedico = async (req, res=response) => {

    const uid = req.uid;
    const medico = new Medico({ 
       usuario:uid,
        ...req.body 
    });

    try {
        
        const medicoDB = await medico.save();
        

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}



const actualizarMedico = async (req,res=response) => {


    const id = req.params.id;   //Recogemos la id que se encuentra en le request 
    const uid = req.uid;    //Tenemos acceso a la id porque pasa por el JWT 
    try{
        const medico = await Medico.findById(id)

        if ( !medico){
            return res.status(404).json({
                ok:true,
                msg:'Medico no encontrado ',
                id
            })
        }

        const cambiosMedico = { //Objeto donde se cambian los datos del medico 
            ...req.body,
            usuario: uid   //Sirve para mostar el id del usuario que lo esta cambiando

        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id,cambiosMedico,{new: true});
       // {new: true} REGRESA EL ULTIMO CAMBIO ACTUALIZADO 
        res.json({
            ok:true,
            msg:'updateMedico',
            medico:medicoActualizado
        })

    }catch (error){
        res.status(500).json({
            ok:false,
            msg:"hable con el admin"
        })
    }
}



const borrarMedico = async (req, res=response) => {
    const id = req.params.id;   //Recogemos la id que se encuentra en le request 
    try{
        const medico = await Medico.findById(id)

        if ( !medico){
            return res.status(404).json({
                ok:true,
                msg:'Medico no encontrado ',
                id
            })
        }
        await Medico.findByIdAndDelete( id );
        res.json({
            ok:true,
            msg:'DelteMedico'
        })

    }catch (error){
        res.status(500).json({
            ok:false,
            msg:"hable con el admin"
        })
    }
}



module.exports = {
    getMedicos,crearMedico,actualizarMedico,borrarMedico
}