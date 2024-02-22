'user strict'

import Animal from './animal.model.js'
import User from '../users/user.model.js'

export const prueba = (req, res) => {
    return res.send('AaAaAaAaA')
}

// export const guardar = async (req, res) => {
//     try {
//         let data = req.body
//         let animal = new Animal(data)
//         await animal.save()
//         return res.send({ message: 'Animal registered successfully' })
//     } catch (err) {
//         console.log(err)
//         return res.status(500).send({ message: 'Error registering animal', err })
//     }
// }

export const save = async(req, res)=>{
    try {
        //Capturar la data
        let data = req.body
        //Validar que el keeper exista
    let user = await User.findOne({_id: data.keeper})
        if(!user) return res.status(404).send({message: 'Keeper not found'})
        //Crear la instancia del Animal
        let animal = new Animal(data)
        //Guardar el animal
        await animal.save()
        //Responder si todo sale bine
        return res.send({message: 'Animal saved successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving Animal'})
    }
}

// export const actualizar = async (req, res) => {
//     try {
//         let { id } = req.params
//         let data = req.body
        
//         let updateAnimal = await Animal.findOneAndUpdate(
//             { _id: id },
//             data,
//             { new: true }
//         )

//         if (!updateAnimal) return res.status(401).send({ message: 'Animal not found and not update' })
//         return res.send({ message: 'Update animal', updateAnimal })
//     } catch (err) {
//         console.error(err)
//         return res.status(500).send({ message: 'Error updating animal' })
//     }
// }

export const actualizar = async(req, res)=>{
    try {
        //Capturar el id
        let {id} = req.params
        //capturar la data
        let data = req.body
        //Validar que vengan datos
        let update =checkUpdate(data, false)
        if(!update)return res.status(400).send({message : 'HAVE SUBMITTED SOMA DATA That cannot be udate'})
        //Actualizar
        let updateAnimal = await Animal.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
            ).populate('keeper',['name','phone'])
            //Validar la actualizacion
            if(!updateAnimal)return res.status(400).send({message: 'Animal not found, not updated'})
            return res.send({ message: 'Update animal', updateAnimal })
    } catch (error) {
        console.error(err)
       return res.status(500).send({ message: 'Error updating animal' })
        
    }
}

// export const borrar = async (req, res) => {
//     try {
//         let { id } = req.params
//         let deleteAnimal = await Animal.findOneAndDelete({ _id: id })
//         if (!deleteAnimal) return res.status(400).send({ message: 'Animal not found and not deleted' })
//         return res.send({ message: `Animal with name ${deleteAnimal.name} delete successfully` })
//     } catch (err) {
//         console.error(err)
//         return res.status(500).send({ message: 'error deleting Animal' })
//     }
// }

export const borrar = async(req, res)=>{
    try {
        //X verificar si tiene una reunion en proceso
        //Capturar el id del animal
        let {id} =req.params
        //Eliminar
        let deleteAnimal = await Animal.deleteOner({_id:id})
        //Validar que se elimino
        if(deleteAnimal.deletedCount == 0) return res
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error deleting animal'})
    }
}

//  export const buscar = async(req, res) => {
//      try {
//          let data = await Animal.find();
//          console.log(data)
//          if(!data.length) {
//              console.log('No hay datos existentes')
//          }
//          return res.status(200).json({
//            message,
//            data
//          });
//      }
//      catch(e) {
//          console.error(e);
//          let message = 'error en la consulta ';
//          return res.status(500).json({
//              message
//          });
//      }
//  }

export const search = async (req, res) =>{
    try {
        //Obtener el parametro de busqueda
        let {search} = req.body
 
        //Buscar
        let animals = await Animal.find(
            {name: search}
        ).populate('keeper',['name', 'phone'])
 
        //Validar la respuesta
        if(animals.leght == 0) return res.status (404).send({message: 'Animal not found'})
 
        //Rsponder si todo sale bien
        return res.send({message:'Animals found', animals})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting animals'})
    }
}
 

export const get = async(req, res)=>{
    try {
        let animals = await Animal.find()
        return res.send({animals})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting animals'})
    }
}