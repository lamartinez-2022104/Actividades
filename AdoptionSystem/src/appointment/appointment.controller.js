'use strict'

import Animal from '../animal/animal.model.js'
import Appointment from './appointment.model.js'

export const save = async(req,res)=>{
    try {
        //Capturar la data
        let data = req.body
        data.user = req.user._id
        //Verificar que exist el animal
        let animal = await Animal.findOne({_id: data.animal})
        if(!animal) return res.status(404).send({message: 'Animal not found'})

        //Validar que la mascota no tenga una cita activa con esa persona
        //vALIDAR si un usario o animal ta tiene una cita
        let appointmentExist = await Appointment.findOne({
            $or: [
                {
                    animal: data.animal, 
                    user: data.user
                },
                {
                    date: data.date,
                    user: data.user
                }
            ]   
        })
        if(appointmentExist) return res.send({message: 'Appointment already exist'})
        //Ejercicio <-solo puede tener una cita por día
        if(date = data.date) return res.send({message: 'no se puede hacer la cita en la misma fecha'})
        //Guardar
        let appointment = new Appointment(data)
        await appointment.save()
        return res.send({message:`Appointment saved succesfully, for the date ${appointment.date}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error saving appointment', err})
    }
}