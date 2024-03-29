require('dotenv').config()
const User = require('../Models/User.model')
const jwt = require('jsonwebtoken')
const mysql = require('./../data/mysql')
const axios = require('axios')

module.exports = {
    async index(req, res) {
        const users = await User.find(null, 'name lastName email')
        return res.json(users);
    },

    async userByUsername(req, res) {
        const username = req.query.username
        let connection = null

        try {
            connection = await mysql.open()
            const user = await mysql.userByUsername(connection, username)

            mysql.close(connection)

            return res.json(user)
        } catch (e) {
            console.error('error in userByUsername')
            if (connection) mysql.close(connection)
            return res.sendStatus(500)
        }
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
            let user = await mysql.userExists(connection, { name, passwd, email }).catch()
            let error = false
            let response = null

            if (user && user.length === 0) {

                user = {
                    name,
                    passwd,
                    email
                }

                const params = new URLSearchParams()

                params.append('login', user.name)
                params.append('password', user.passwd)

                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                const url = process.env.PW_CREATE_ACCOUNT

                await axios.post(url, params, config)
                    .then(async (result) => {
                        await mysql.updateEmail(connection, user)
                            .catch(e => {
                                console.error('error in updateEmail', e)
                                error = true
                                response = 409
                            })
                    })
                    .catch((e) => {
                        console.error('error in creating account', e)
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
            if (await validPassword(name, passwd)) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    passwd: user.passwd
                }

                const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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

validPassword = async (name, password) => {
    const params = new URLSearchParams()

    params.append('login', name)
    params.append('password_old', password)
    params.append('password_new', password)

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const url = process.env.PW_CHANGE_PASSWORD

    let ok = true

    await axios.post(url, params, config)
        .then(async (result) => {
            if(result.data.includes('Old Password Mismatch') || result.data.includes('Only 4-10 Characters'))
                ok = false
        })
        .catch((e) => {
            console.error('error in password call', e)
        })

    return ok
}