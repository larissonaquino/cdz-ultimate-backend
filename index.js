const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'prod')
    require('dotenv').config()

const app = express()
const PORT = process.env.PORT

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cdz-ultimate.biz00.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e => {
    console.error('error in connect to MongoDB', e)
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

app.use(limiter)
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT);
console.log(`Running on ${PORT}...`);