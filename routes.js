const { Router } = require('express')
const UserController = require('./src/Controllers/UserController')
const TeamController = require('./src/Controllers/TeamController')

const routes = Router()

routes.get('/users', UserController.index)

routes.get('/team', TeamController.index)

routes.get('/userByEmail', UserController.userByEmail)

routes.post('/login', UserController.authenticate)

routes.post('/register', UserController.register)

routes.post('/teamRegister', TeamController.register)

routes.post('/authorization', UserController.authorization)

module.exports = routes;