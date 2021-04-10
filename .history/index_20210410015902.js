const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')
const mercadopago = require("mercadopago");

exports.checkout = functions.https.onCall((preference, context) => {
    return mercadopagoCtrl.makecheckout(preference).then(response => {
        // Este es el checkout generado o link al que nos vamos a posicionar para pagar
        console.log(response.body.init_point);
        let init_point = response.body.init_point
        return {
            result: init_point
        };
    }).catch(error => {
        console.log(error);
        return error
    });
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

// Integração mercadopago
// mercadopago.configurations.setAccessToken("YOUR_ACCESS_TOKEN"); 

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("../../client"));

// app.get("/", function (req, res) {
//   res.status(200).sendFile("index.html");
// }); 

// app.post("/create_preference", (req, res) => {

// 	let preference = {
// 		items: [{
// 			title: req.body.description,
// 			unit_price: Number(req.body.price),
// 			quantity: Number(req.body.quantity),
// 		}],
// 		back_urls: {
// 			"success": "http://localhost:8080/feedback",
// 			"failure": "http://localhost:8080/feedback",
// 			"pending": "http://localhost:8080/feedback"
// 		},
// 		auto_return: 'approved',
// 	};

// 	mercadopago.preferences.create(preference)
// 		.then(function (response) {
// 			res.json({id :response.body.id})
// 		}).catch(function (error) {
// 			console.log(error);
// 		});
// });

// app.get('/feedback', function(request, response) {
// 	 response.json({
// 		Payment: request.query.payment_id,
// 		Status: request.query.status,
// 		MerchantOrder: request.query.merchant_order_id
// 	})
// });

// app.listen(8080, () => {
//   console.log("The server is now running on Port 8080");
// });