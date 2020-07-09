var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = process.env.DB_NAME;
const collection = 'reviews'

router.post('/', function (req, res, next) {

  MongoClient.connect(url, function (err, client) {

    const db = client.db(dbName);
    db.collection(collection).updateOne({ username: req.body.username }, [{ $set: req.body }, { $project: { _id: 0 } }], { upsert: true }, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send()
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