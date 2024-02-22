'user strict'

import express from 'express'
import {save, actualizar, borrar, search, get, prueba } from './animal.controller.js'
import {validateJwt, isAdmin} from '../middlewares/validate-jwt.js'

const api = express.Router()


api.post('/guardar',[validateJwt, isAdmin] ,save)
api.put('/actualizar', [validateJwt, isAdmin],actualizar)
api.delete('/borrar',[validateJwt, isAdmin], borrar )


api.get('/buscar',[validateJwt], search)
api.get('/listar', [validateJwt], get)

api.get('/test', prueba)
export default api