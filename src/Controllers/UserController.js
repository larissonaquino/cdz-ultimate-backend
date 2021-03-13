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
        let connection = null

        try {
            connection = await mysql.open()
            const user = await mysql.userByEmail(connection, email)

            mysql.close(connection)

            return res.json(user)
        } catch (e) {
            console.error('error in userByEmail')
            if (connection) mysql.close(connection)
            return res.sendStatus(500)
        }
    },

    async register(req, res) {
        const { name, passwd, email } = req.body

        try {
            const connection = await mysql.open()
            let user = await mysql.userExists(connection, {name, passwd, email}).catch()
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
            } else {
                error = true
                response = 422
            }

            mysql.close(connection)
            return error ? res.sendStatus(response) : res.json(user)
        }
        catch (e) {
            console.error('error in register method', e)
            return res.sendStatus(500)
        }
    },

    async authenticate(req, res) {
        const { name, passwd } = req.body
        const connection = await mysql.open()

        let [user] = await mysql.userByUsername(connection, name).catch((e) => {
            console.error('erro ao tentar conectar-se ao mysql', e)
        })
        mysql.close(connection)

        if (user) {
            if (await validPassword(passwd, user.passwd)) {
                const obj = await {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    passwd: user.passwd
                }
                
                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
                
                delete user.passwd
                return res.json(user)
            })
        } catch (e) {
            return res.sendStatus(401)
        }
    }
}

validPassword = async (password, hash) => await bcrypt.compare(password, hash)