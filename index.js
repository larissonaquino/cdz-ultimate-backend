const express = require('express')
const routes = require('./routes')
const cors = require('cors')

if (process.env.NODE_ENV !== 'prod')
    require('dotenv').config()

const app = express()

const PORT = process.env.PORT

app.use(cors());
app.use(express.json());
app.use(routes); 

app.listen(PORT);
console.log(`Running on ${PORT}...`);