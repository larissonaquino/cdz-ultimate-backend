const mysql = require('mysql2/promise')

const open = async () => {
    let connection = null

    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_CONNECTION,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DBNAME
        })
    }
    catch (e) {
        if (!connection) console.error('error in opening mysql connection')
        throw new Error(e)
    }

    return connection
}

const close = (connection) => {
    connection.end()
}

const userByEmail = async (connection, email) => {
    try {
        const [user] = await connection.query("SELECT id, name, email, passwd FROM `users` WHERE `email` = ?", [email])
        return user
    }
    catch (e) {
        console.error("error in try to execute userByEmail method at mysql.js", e)
        throw new Error("Erro ao tentar executar userByEmail", e)
    }
}

const userByUsername = async (connection, username) => {
    try {
        const [user] = await connection.query("SELECT id, name, email, passwd FROM `users` WHERE `name` = ?", [username])
        return user
    }
    catch (e) {
        console.error("error in try to execute userByUsername method at mysql.js", e)
        throw new Error("Erro ao tentar executar userByUsername", e)
    }
}

const userExists = async (connection, user) => {
    try {
        const [userAlreadyExists] = await connection.query("SELECT 1 FROM `users` WHERE `name` = ? OR email = ?", [user.name, user.email])

        if (userAlreadyExists.length > 0) return null

        return userAlreadyExists
    }
    catch (e) {
        console.error("error in try to execute userExists method at mysql.js", e)
        throw new Error("Erro ao tentar executar userExists", e)
    }
}

const register = async (connection, user) => {
    try {
        const [newUser] = await connection.query(`
            INSERT INTO users (id, name, passwd, passwd2, email)
            SELECT (SELECT MAX(id) + 16 FROM users) AS ID, ?, ?, ?, ?`, [user.name, user.passwd, user.passwd, user.email]).catch(e => { throw new Error(e) })

        return newUser
    }
    catch (e) {
        throw new Error(e)
    }
}

const updateEmail = async (connection, user) => {
    try {
        const [response] = await connection.execute(`
            UPDATE users SET email = ? WHERE name = ?`, [user.email, user.name]).catch(e => { throw new Error(e) })

        return response
    }
    catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    open, close, userByEmail, userByUsername, userExists, register, updateEmail
}