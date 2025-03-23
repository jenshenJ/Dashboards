const axios = require('axios');

const { apiToken } = require('../../../config/token');

module.exports = function(app, db) {
	 // Обработчик GET-запроса для получения всех отзывов с заданным kpID
	 app.get('/movies', async (req, res) => {
        try {

            if (req.query.search) {
                const movies = await axios.get(`https://api.kinopoisk.dev/v1.4/movie/search`, {
                    params: {
                      limit: 10,
                      query: req.query.search,
                    },
                    headers: {
                      'Content-Type': 'application/json',
                      'X-API-KEY': apiToken,
                    }
                  });

                res.status(200).json(movies.data.docs);
                return;
            }

            const movies = await axios.get(`https://api.kinopoisk.dev/v1.4/movie`, {
                params: {
                  lists: 'top250',
                  limit: 250,
                  selectedFields: '',
                },
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-KEY': apiToken,
                }
              });

    
              res.status(200).json(movies.data.docs.map(({
                id,
                name,
                alternativeName,
                year,
                rating,
                poster,
                countries,
                top250,
                genres,
              }) => ({
                id,
                name,
                alternativeName,
                year,
                rating,
                poster,
                countries,
                top250,
                genres,
              })).sort((a, b) => a.top250 - b.top250).filter(item => item.top250));

        } catch (error) {
            res.status(500).send({error: `Ошибка при получении списка фильмов: ${error}`});
        }
	});

    app.get('/movie', async (req, res) => {
        try {
            const movie = await axios.get(`https://api.kinopoisk.dev/v1.4/movie/${Number(req.query.id)}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-KEY': apiToken,
                }
            });

            res.status(200).json(movie.data);

        } catch (error) {
            res.status(500).send({error: `Ошибка при получении данных фильма: ${error}`})
        }
    });
};
