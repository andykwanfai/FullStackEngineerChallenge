var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;
const collection = 'users'
const user_projection = { password: 0, _id: 0 }

const secret = 'abcdefg';

router.post('/', function (req, res, next) {

  //hash the password, disabled for the convenience of creating new users
  // const hash = crypto.createHmac('sha256', secret)
  //   .update(req.body.user + req.body.password)
  //   .digest('hex');
  // console.log(hash)
  const hash = req.body.password
  MongoClient.connect(url, function (err, client) {

    const db = client.db(dbName);
    db.collection(collection).findOne({ username: req.body.username, password: hash }, { projection: user_projection }, function (err, result) {
      if (err) {
        console.log(err);
      }
      // console.log(result)
      if (result) {
        return res.send(result);
      } else {
        return res.status(401).send();
      }
    });

    client.close();
  });
});

module.exports = router;