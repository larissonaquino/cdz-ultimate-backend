const { Router } = require('express')
const UserController = require('./src/Controllers/UserController')

const routes = Router()

routes.get('/users', UserController.index)

routes.get('/userByEmail', UserController.userByEmail)

routes.post('/login', UserController.authenticate)

routes.post('/register', UserController.register)

routes.post('/authorization', UserController.authorization)

module.exports = routes;