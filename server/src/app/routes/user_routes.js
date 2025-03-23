const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;
const auth = require('../middlewares/auth');
const { JWT_SECRET } = require('../../../config/secret');

module.exports = function(app, db) {
  app.post('/signup', async (req, res) => {
    const users = db.collection('users');
    const { username, password } = req.body;

    try {
        const existingUser = await users.findOne({username});
    
        if (existingUser) {
            return res.status(400).send({ error: 'Пользователь уже существует'});
        }
    
        const newUser = { username, password, reviews: [] };
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        newUser.password = hashedPassword;
    
        const userId = (await users.insertOne(newUser)).insertedId;
    
        const payload = {
            user: {
                id: userId,
            },
        };
    
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '7 days'},
            (err, token) => {
                if (err) throw(err);
                res.json({token});
            }
        )
    } catch (err) {
        res.status(500).send('Server error');
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = db.collection('users');

    try {
      // check if the user exists
      let user = await users.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Неправильный логин или пароль' });
      }

      // check is the encrypted password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Неправильный логин или пароль' });
      }

      // return jwt
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '30 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  app.get('/user', auth, async (req, res) => {
    try {
      const users = db.collection('users');
      const {username, _id, reviews, willWatch, watched, estimations, isAdmin } = await users.findOne({_id: new ObjectId(req.user.id)});

      res.status(200).json({ username, _id, reviews, willWatch, watched, estimations, isAdmin });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.get('/clients', async (req, res) => {
    const users = db.collection('users');

    const query = {
      companies: { $exists: true, $ne: [] }
    };

    const result = await users.find(query).toArray();

    console.log(result)
    res.status(200).json(result);
  });
};
