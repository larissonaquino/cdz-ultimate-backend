const mysql = require('mysql2/promise')

const open = () => {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_CONNECTION,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DBNAME
    })

    return connection
}

const close = (connection) => {
    connection.end()
}

const userByEmail = async (connection, email) => {
    try {
        const [user] = await connection.query("SELECT id, name, email FROM `users` WHERE `email` = ?", [email])
        return user
    }
    catch(e) {
        console.error("Erro ao tentar executar userByEmail", e)
        throw new Error("Erro ao tentar executar userByEmail", e)
    }
}

const register = async (connection, user) => {
    try {
        const [userExists] = await connection.query("SELECT 1 FROM users WHERE email = ?", [user.email])
        
        if (userExists.length > 0) return null
    
        const [newUser] = await connection.query(`
            INSERT INTO users (id, name, passwd, passwd2, email)
            SELECT (SELECT MAX(id) + 1 FROM users) AS ID, ?, ?, ?, ?`, [user.name, user.passwd, user.passwd, user.email]).catch(e => { throw new Error(e) })
    
        return newUser
    }
    catch (e) {
        throw e
    }
}

module.exports = {
    open, close, userByEmail, register
}