const axios = require('axios');

const { apiToken } = require('../../../config/token');
const auth = require('../middlewares/auth');
const ObjectId = require('mongodb').ObjectId;

module.exports = function(app, db) {
	app.post('/reviews', auth, async (req, res) => {
		const users = db.collection('users');
      	const {username, _id, reviews} = await users.findOne({_id: new ObjectId(req.user.id)});


		const review = {
			review: req.body.review,
			title: req.body.title, 
			type: req.body.type,
			movieId: Number(req.body.movieId),
			author: username,
			authorId: _id,
		};

		const query = { _id }; // Update the document with the matching documentId
 		const update = { $set: { reviews: reviews ? [...reviews, review] : [review] } };

		try {
			const result = await db.collection('reviews').insertOne(review);
			await users.updateOne(query, update);
			res.send(result);
		} catch (error) {
			res.send({error});
		}
	});

	app.post('/estimate', auth, async (req, res) => {
		const users = db.collection('users');
      	const {_id, estimations } = await users.findOne({_id: new ObjectId(req.user.id)});

		const query = { _id }; // Update the document with the matching documentId
		let update;
		if (!estimations?.find((item) => item.movieId === req.body.movieId)) {
			update = { $set: { estimations: estimations
				? [...estimations, { movieId: req.body.movieId, estimate: req.body.estimate}]
				: [{ movieId: req.body.movieId, estimate: req.body.estimate}] } };
		} else {
			const filteredEstimations = estimations.filter((item) => item.movieId != String(req.body.movieId));
			update = { $set: { estimations: filteredEstimations}};
		}

		try {
			const result = await users.updateOne(query, update);
			res.send(result);
		} catch (error) {
			console.log(error);
			res.send({error});
		}
	});

	app.post('/willwatch', auth, async (req, res) => {
		const users = db.collection('users');
      	const {_id, willWatch, watched} = await users.findOne({_id: new ObjectId(req.user.id)});

		const query = { _id }; // Update the document with the matching documentId
		let update;
		if (!willWatch || !willWatch?.includes(req.body.movieId)) {
			update = { $set: { willWatch: willWatch ? [...willWatch, req.body.movieId] : [req.body.movieId] } };
		} else {
			update = { $set: { willWatch: willWatch.filter((item) => item !== req.body.movieId)}};
		}

		try {
			const result = await users.updateOne(query, update);
			res.send(result);
		} catch (error) {
			console.log(error);
			res.send({error});
		}
	});

	app.post('/watched', auth, async (req, res) => {
		const users = db.collection('users');
      	const {_id, watched, willWatch} = await users.findOne({_id: new ObjectId(req.user.id)});

		const query = { _id }; // Update the document with the matching documentId
 		
		let update;
		if(!watched || !watched?.includes(req.body.movieId)) {
			update = { $set: { 
				willWatch: willWatch ? willWatch.filter((item) => item != req.body.movieId) : [],
				watched: watched ? [...watched, req.body.movieId] : [req.body.movieId],
			}};
		} else {
			update = { $set: { 
				watched: watched.filter(item => item !== req.body.movieId),
			}};
		}
	


		try {
			const result = await users.updateOne(query, update);
			res.send(result);
		} catch (error) {
			console.log(error);
			res.send({error});
		}
	});

	 // Обработчик GET-запроса для получения всех отзывов с заданным kpID
	 app.get('/reviews', async (req, res) => {
		const movieId = Number(req.query.movieId);
	
		if (!movieId) {
		  	return res.status(400).send({ error: 'Параметр MovieId обязателен' });
		}
	
		try {
			const localReviews = await db.collection('reviews').find({ movieId: movieId }).toArray();
			const kpReviews = await axios.get(`https://api.kinopoisk.dev/v1.4/review`, {
				params: {
				  movieId: movieId
				},
				headers: {
				  'Content-Type': 'application/json',
				  'X-API-KEY': apiToken,
				}
			  });

			res.status(200).json([...localReviews, ...kpReviews.data.docs]);
		} catch (error) {
		  	res.status(500).send({ error: `Ошибка при получении отзывов: ${error}` });
		}
	});
	
};
