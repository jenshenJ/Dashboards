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

	  console.log(userId, 'userId');

      // Получаем данные пользователя из БД
      const users = db.collection('users');
      const {username, _id, companies} = await users.findOne({_id: new ObjectId(userId || req.user.id)});

	  const result = {
		companies: [],
	  }

	  for (const id of companies) {
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
				}
			},
			direct: {
				CTR: {
					value: `${(100 * realClicksDirect / realImpressionsGoogle).toFixed(2)}%`,
					title: 'CTR',
				},
				CPC: {
					value: (realCostDirect / realClicksDirect).toFixed(2),
					title: 'CPC',
				},
				CPM: {
					value: (realImpressionsDirect / realCostDirect / 1000).toFixed(2),
					title: 'CPM',
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
  });
};