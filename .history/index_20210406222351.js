const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');
// Configura credenciais
mercadopago.configure({
    access_token: 'APP_USR-3498903699968178-032718-8e24418274c111c52b4952d80a5af608-181779562'
  });
// Cria um objeto de preferência
let preference = {
    items: [
      {
        title: 'Meu produto',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor substituirá a string "<%= global.id %>" no seu HTML
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
  });
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

app.use(cors());
app.use(express.json());
app.use(routes); 

app.listen(PORT);
console.log(`Running on ${PORT}...`);