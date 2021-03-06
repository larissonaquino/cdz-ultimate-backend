const { Router } = require('express')
const UserController = require('./src/Controllers/UserController')
const TeamController = require('./src/Controllers/TeamController')

const routes = Router()

routes.get('/api/users', UserController.index)

routes.get('/api/team', TeamController.index)

routes.get('/api/userByEmail', UserController.userByEmail)

routes.post('/api/login', UserController.authenticate)

routes.post('/api/register', UserController.register)

routes.post('/api/teamRegister', TeamController.register)

routes.post('/api/authorization', UserController.authorization)

module.exports = routes;