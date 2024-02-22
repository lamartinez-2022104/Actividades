'use strict'

import User from './user.model.js' //Unico que puede ir en mayúscula
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
export const test = (req, res) => {
    return res.send('Hello world')
}

export const register = async (req, res) => {
    try {
        //Capturar la información del cliente (body)
        let data = req.body;

        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        // asignar el rol por defecto 
        data.role = 'CLIENT' //si viene con otro valor o no viene, lo asigna con rol Cliente

        //Crear una instacia del modelo(schema)
        let user = new User(data)

        //Guardar la información 
        await user.save()

        //Respondo al usuario
        return res.send({ message: 'registered successfully' })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error registering user ', err })
    }
}

export const login = async (req, res) => {
    try {
        //Capturar la información (body)
        let { username, password } = req.body
        //Validar en el usuario existe
        let user = await User.findOne({ username })
        //Verifica que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            //Responder (dar acceso)
            return res.send({ message: `Welcome ${user.name}`, loggedUser, token })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const update = async (req, res) => { // Usarios logeados
    try {
        //Obtener el id del usuario a actualizar
        let { id } = req.params

        //Obtener datos que vamos a actualizar
        let data = req.body

        //Validar si trae datos a actualizar
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing data' })

        //Validar si tiene permisos (tokenizacion)

        //Actualizamos en la DB
        let updateUser = await User.findOneAndUpdate(
            { _id: id }, //ObjectId <- hexadeciaml (Hola sys, version mongo, llave privada...)
            data, //Datos que va a actualizar
            { new: true }//Objeto de la DB ya actualizado

        )
        //Validar si se actualizó
        if (!updateUser) return res.status(401).send({ message: 'User not found and not update' })
        //Responder con el dato actualizado
        return res.send({ message: 'Update user', updateUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async (req, res) => {
    try {
        //Obtener el id
        let { id } = req.params
        //Validar si esta logeado y es el mismo 
        //Eliminar (deleteOne / findOneAndDelete)
        let deletedUser = await User.findOneAndDelete({ _id: id })
        //Verificar que se elimino
        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        //Responder
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}