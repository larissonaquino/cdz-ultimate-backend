require('dotenv').config()
const User = require('../Models/User.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('./../data/mysql')

module.exports = {
    async index(req, res) {
        const users = await User.find(null, 'name lastName email')
        return res.json(users);
    },

    async userByEmail(req, res) {
        const email = req.query.email

        try {
            const connection = await mysql.open()
            const user = await mysql.userByEmail(connection, email)
            
            mysql.close(connection)
            
            return res.json(user)
        }
        catch(e) {
            console.error('error in userByEmail', e)
            mysql.close(connection)
            return res.sendStatus(500)
        }
    },

    async register(req, res) {
        const { name, passwd, email } = req.body
        const connection = await mysql.open()
        let user = await mysql.userByEmail(connection, email).catch()
        let error = false
        let response = null
        
        if (user && user.length === 0) {
            const hashedPassword = await bcrypt.hash(passwd, 10)

            user = {
                name,
                passwd: hashedPassword,
                email
            }
            
            newUser = await mysql.register(connection, user)
                .catch(e => {
                    console.error('error in register user', e)
                    error = true
                    response = 409
                })
            }
        else {
            error = true
            response = 422
        }
        
        mysql.close(connection)
        return error ? res.sendStatus(response) : res.json(user)
    },

    async authenticate(req, res) {
        const { email, passwd } = req.body
        const connection = await mysql.open()
        
        let user = await mysql.userByEmail(connection, email).catch()
        mysql.close(connection)
        
        if (user && user.length > 0) {
            if (await validPassword(passwd, user.passwd)) {
                const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
                return res.json({ token })
            }
        }
        
        return res.sendStatus(401)
    },

    async authorization(req, res) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(414)

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403)
                
                return res.json(user)
            })
        }
        catch(e) {
            return res.sendStatus(401)
        }
    }
}

validPassword = async (password, hash) => await bcrypt.compare(password, hash)