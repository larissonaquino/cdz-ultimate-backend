require('dotenv').config()
const User = require('../Models/User.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async index(req, res) {
        const users = await User.find(null, 'name lastName email')
        return res.json(users);
    },

    async userByEmail(req, res) {
        let email = req.query.email

        let user = await User.findOne({ email }, 'name email').exec()
        .catch(e => {
            e.console.error('error in userByEmail', e)
            return res.sendStatus(500)
        })

        return res.json(user)
    },

    async register(req, res) {
        const { name, lastName, email, password } = req.body
        
        let user = await User.findOne({ email })
        
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10)
            
            user = await User.create({
                name,
                lastName,
                email,
                password: hashedPassword
            })
            .catch(e => {
                console.error('error in register user', e)
                return res.sendStatus(500)
            })
        }
        else return res.sendStatus(422)
        
        return res.json(user)
    },

    async authenticate(req, res) {
        const { email, password } = req.body
        
        let user = await User.findOne({ email })
        
        if (user) {
            if (await validPassword(password, user.password)) {
                const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
                res.setHeader('token', `Bearer ${token}`)
                return res.json({ token })
            }
        }

        return res.sendStatus(401)
    },

    async authorization(req, res) {
        const authHeader = req.headers['token']
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