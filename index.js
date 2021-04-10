const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')
const mercadopago = require("mercadopago");


// mercadopago.configure({
//     access_token: 'APP_USR-3498903699968178-032718-8e24418274c111c52b4952d80a5af608-181779562'
// });

// let preference = {
//     items: [{
//         title: 'Meu produto',
//         unit_price: 100,
//         quantity: 1,
//     }]
// };

// mercadopago.preferences.create(preference)
//     .then(function (response) {
//         // Este valor substituirá a string "<%= global.id %>" no seu HTML
//         global.id = response.body.id;
//     }).catch(function (error) {
//         console.log(error);
//     });

mercadopago.configurations.setAccessToken("APP_USR-3498903699968178-032718-8e24418274c111c52b4952d80a5af608-181779562");

var payment_data = {
  transaction_amount: Number(req.body.transactionAmount),
  token: req.body.token,
  description: req.body.description,
  installments: Number(req.body.installments),
  payment_method_id: req.body.paymentMethodId,
  issuer_id: req.body.issuer,
  payer: {
    email: req.body.email,
    identification: {
      type: req.body.docType,
      number: req.body.docNumber
    }
  }
};

mercadopago.payment.save(payment_data)
  .then(function(response) {
    res.status(response.status).json({
      status: response.body.status,
      status_detail: response.body.status_detail,
      id: response.body.id
    });
  })
  .catch(function(error) {
    res.status(response.status).send(error);
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