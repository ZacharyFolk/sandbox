const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGO_DB_CONNECTION;

async function connect() {
  const client = new MongoClient(mongoURI);
  await client.connect();
  return client.db('cagematchdb');
}

async function insertScore(initials, time, hearts) {
  const db = await connect();
  const leaderboard = db.collection('leaderboard');
  await leaderboard.insertOne({ initials, time, hearts });
}

module.exports = { connect, insertScore };
