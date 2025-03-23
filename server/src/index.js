const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('../config/db');
const cors 		 = require('cors');
const app            = express();
const port = 8000;
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:5173',
	methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
	allowedHeaders: 'X-Requested-With,content-type,x-auth-token',
	credentials: true,
}));

MongoClient.connect(db.url)
	.then((database) => {
		const db = database.db('filmoiskatel');
		require('./app/routes')(app, db);

		app.listen(port, () => {
			console.log('We are live on ' + port);
		});              
	})
	.catch((error) => console.log('error', error));
