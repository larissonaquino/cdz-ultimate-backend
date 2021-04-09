const { Router } = require('express')
const UserController = require('./src/Controllers/UserController')
const TeamController = require('./src/Controllers/TeamController')
const rateLimit = require('express-rate-limit')

const routes = Router()

const TeamLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    message:
        "Too many accounts created from this IP, please try again after an hour"
})

const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message:
        "Too many accounts created from this IP, please try again after an hour"
})

const authenticateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    message:
        "Too many accounts created from this IP, please try again after an hour"
})

const authorizationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message:
        "Too many accounts created from this IP, please try again after an hour"
})

// INTERNAL
routes.get('/api/users', UserController.index)

routes.get('/api/userByUsername', UserController.userByUsername)

routes.get('/api/userByEmail', UserController.userByEmail)

routes.post('/api/teamRegister', TeamController.register)

// EXTERNAL
routes.get('/api/team', TeamLimiter, TeamController.index)

routes.post('/api/register', registerLimiter, UserController.register)

routes.post('/api/authenticate', authenticateLimiter, UserController.authenticate)

routes.post('/api/authorization', authorizationLimiter, UserController.authorization)

routes.get('api/health', (req, res) => {
    return res.json({ health: 'healthy' })
})

module.exports = routes;