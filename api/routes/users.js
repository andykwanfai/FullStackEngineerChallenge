var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;
const collection = 'users'

const user_projection = { password: 0, _id: 0, "reviews._id": 0 }

/* GET users listing. */
router.get('/', function (req, res, next) {
  MongoClient.connect(url, function (err, client) {

    const db = client.db(dbName);

    db.collection(collection).aggregate([
      {
        $lookup:
        {
          from: 'reviews',
          localField: 'username',
          foreignField: 'username',
          as: 'reviews'
        }
      }
    ]).project(user_projection).toArray(function (err, result) {
      if (err) {
        console.log(err);
      }

      return res.send(result);
    });

    client.close();
  });
});

router.get('/:username', function (req, res, next) {
  MongoClient.connect(url, function (err, client) {

    const db = client.db(dbName);
    db.collection(collection).findOne({ username: req.params.username }, { projection: user_projection }, function (err, result) {
      if (err) {
        console.log(err);
      }

      return res.send(result);
    });

    client.close();
  });
});

module.exports = router;
