'use strict'
//RUTAS DEL USUARIO

import express from 'express'
import {
    isAdmin,
    validateJwt
} from '../middlewares/validate-jwt.js'
import {
    test,
    register,
    login,
    update,
    deleteU
} from './user.controller.js'

const api = express.Router()

api.get('/test', [validateJwt, isAdmin], test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteU)

export default api

// export const api //TENGO QUE UTILIZAR SI O SI EL NOMBRE QUE ESTA EN EL ARCHIVO
// export default api //TENGO QUE IMPORTAR CON OTRO NOMBRE EJ: userROUTES