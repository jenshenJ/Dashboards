const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { apiToken } = require('../../../config/token');
const auth = require('../middlewares/auth');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

module.exports = function(app, db) {
  app.get('/companies', auth, async (req, res) => {
    try {
      // Используем path для раздражения безопасного пути
      const filePath = path.resolve(__dirname, '../../../config/companies.json');
      // Читаем файл и парсим JSON
      const fileData = fs.readFileSync(filePath, 'utf8');
      const obj = JSON.parse(fileData);
      console.log(obj);

	  const start = req.query.startDate;
	  const end = req.query.endDate;
	  const userId = req.query.userId;


      // Получаем данные пользователя из БД
      const users = db.collection('users');
      const {companies} = await users.findOne({_id: new ObjectId(userId || req.user.id)});

	  const result = {
		companies: [],
	  }

	  for (const id of companies) {
		console.log(companies);
		result.companies.push(obj[id]);
	  }

	  for (const company of result.companies) {
		company.totalLength = company.data.length;
	  }

	  if (start && end) {
		for (const company of result.companies) {
			company.data = company.data.filter((element) => element.date >= start && element.date <= end);
		  }
	  }


	  for (const company of result.companies) {
		const period = company.data.length;

		if (!company.totalLength) {
			break;
		}

		company.kpiDataGoogle = [];
		company.kpiDataDirect = [];

		const plannedCostGoogle = company.planGoogle.cost / company.totalLength * period;
		const plannedCostDirect = company.planDirect.cost / company.totalLength * period;

		const plannedImpressionsGoogle = Math.floor(company.planGoogle.impressions / company.totalLength * period);
		const plannedImpressionsDirect = Math.floor(company.planDirect.impressions / company.totalLength * period);

		const plannedClicksGoogle = Math.floor(company.planGoogle.clicks / company.totalLength * period);
		const plannedClicksDirect = Math.floor(company.planDirect.clicks / company.totalLength * period);


		let realCostGoogle = 0;
		let realCostDirect = 0;

		let realImpressionsGoogle = 0;
		let realImpressionsDirect = 0;

		let realClicksGoogle = 0;
		let realClicksDirect = 0;

		for (const day of company.data) {
			realCostGoogle += day.google_cost;
			realCostDirect += day.direct_cost;

			realImpressionsGoogle += day.google_impressions;
			realImpressionsDirect += day.direct_impressions;

			realClicksGoogle += day.google_clicks;
			realClicksDirect += day.direct_clicks;
		}

		company.kpiDataGoogle = [[{ 
			name: 'Показы',
			expected: plannedImpressionsGoogle,
			real: realImpressionsGoogle,
		}],
		[{ 
			name: 'Клики',
			expected: plannedClicksGoogle,
			real: realClicksGoogle,
		}],
		[{ 
			name: 'Бюджет',
			expected: plannedCostGoogle,
			real: realCostGoogle,
		}]];

		company.kpiDataDirect = [[{
			name: 'Показы',
			expected: plannedImpressionsDirect,
			real: realImpressionsDirect,
		}],
		[{ 
			name: 'Клики',
			expected: plannedClicksDirect,
			real: realClicksDirect,
		}],
		[{ 
			name: 'Бюджет',
			expected: plannedCostDirect,
			real: realCostDirect,
		}]];
		// Calculate conversions
		let realConversionsGoogle = 0;
		let realConversionsDirect = 0;

		for (const day of company.data) {
			realConversionsGoogle += day.google_conversions || 0;
			realConversionsDirect += day.direct_conversions || 0;
		}

		// Calculate comparison metrics (today vs yesterday)
		const sortedData = [...company.data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		const today = sortedData[0] || {
			google_impressions: 0,
			google_clicks: 0,
			google_cost: 0,
			google_conversions: 0,
			direct_impressions: 0,
			direct_clicks: 0,
			direct_cost: 0,
			direct_conversions: 0
		};
		const yesterday = sortedData[1] || {
			google_impressions: 0,
			google_clicks: 0,
			google_cost: 0,
			google_conversions: 0,
			direct_impressions: 0,
			direct_clicks: 0,
			direct_cost: 0,
			direct_conversions: 0
		};

		company.comparison = {
			google: {
				impressions: {
					current: today.google_impressions,
					previous: yesterday.google_impressions,
					title: 'Показы'
				},
				clicks: {
					current: today.google_clicks,
					previous: yesterday.google_clicks,
					title: 'Клики'
				},
				cost: {
					current: today.google_cost,
					previous: yesterday.google_cost,
					title: 'Бюджет'
				},
				conversions: {
					current: today.google_conversions || 0,
					previous: yesterday.google_conversions || 0,
					title: 'Конверсии'
				}
			},
			direct: {
				impressions: {
					current: today.direct_impressions,
					previous: yesterday.direct_impressions,
					title: 'Показы'
				},
				clicks: {
					current: today.direct_clicks,
					previous: yesterday.direct_clicks,
					title: 'Клики'
				},
				cost: {
					current: today.direct_cost,
					previous: yesterday.direct_cost,
					title: 'Бюджет'
				},
				conversions: {
					current: today.direct_conversions || 0,
					previous: yesterday.direct_conversions || 0,
					title: 'Конверсии'
				}
			}
		};

		company.metrika = {
			google: {
				CTR: {
					value: `${(100 * realClicksGoogle / realImpressionsGoogle).toFixed(2)}%`,
					title: 'CTR',
				},
				CPC: {
					value: (realCostGoogle / realClicksGoogle).toFixed(2),
					title: 'CPC',
				},
				CPM: {
					value: (realImpressionsGoogle / realCostGoogle / 1000).toFixed(2),
					title: 'CPM'
				},
				Conversions: {
					value: realConversionsGoogle,
					title: 'Конверсии'
				}
			},
			direct: {
				CTR: {
					value: `${(100 * realClicksDirect / realImpressionsDirect).toFixed(2)}%`,
					title: 'CTR',
				},
				CPC: {
					value: (realCostDirect / realClicksDirect).toFixed(2),
					title: 'CPC',
				},
				CPM: {
					value: (realImpressionsDirect / realCostDirect / 1000).toFixed(2),
					title: 'CPM',
				},
				Conversions: {
					value: realConversionsDirect,
					title: 'Конверсии'
				}
			}
		}
	}
		


	  


	  console.log(companies);

      // Посылаем результат обратно клиенту
      res.json(result);

    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('Server error');
    }
  })

  // Get comments for a company
  app.get('/companies/:companyId/comments', auth, async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const comments = db.collection('company_comments');
      
      const result = await comments.find({ companyId }).sort({ date: -1 }).toArray();
      
      res.json(result);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('Server error');
    }
  });

  // Add a comment to a company
  app.post('/companies/:companyId/comments', auth, async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const { text } = req.body;
      
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Comment text is required' });
      }
      
      const comments = db.collection('company_comments');
      const users = db.collection('users');
      
      const user = await users.findOne({ _id: new ObjectId(req.user.id) });
      
      const newComment = {
        id: new ObjectId().toString(),
        companyId,
        text,
        author: user.username,
        isAdmin: user.isAdmin || false,
        date: new Date().toISOString()
      };
      
      await comments.insertOne(newComment);
      
      res.status(201).json(newComment);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('Server error');
    }
  });
}