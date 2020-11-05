require('dotenv').config()
const User = require('../Models/User.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const users = []

module.exports = {
    async index(request, response) {
        return response.json(users);
    },

    async newUser(request, response) {
        const user = request.body
        user.password = await bcrypt.hash(user.password, 10)

        users.push(user)
        return response.json(user)
    },

    async authenticate(request, response) {
        const { email, password } = request.body
        const user = users.find(user => user.email === email)

        if (user) {
            if (await validPassword(password, user.password)) {
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                return response.json({ accessToken })
            }
            else return response.sendStatus(401)
        }

        return response.sendStatus(404)
    },

    async authorization(request, response) {
        const authHeader = request.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return response.sendStatus(414)
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return response.sendStatus(403)
            return response.json(user)
        })
    }
}

validPassword = async (password, hash) => await bcrypt.compare(password, hash)