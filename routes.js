const { Router } = require('express')
const UserController = require('./src/Controllers/UserController')

const routes = Router()

routes.get('/users', UserController.index)

routes.post('/login', UserController.authenticate)

routes.post('/register', UserController.newUser)

routes.post('/authorization', UserController.authorization)

module.exports = routes;