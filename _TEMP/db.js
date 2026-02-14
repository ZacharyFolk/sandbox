const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://nick:U2b47mMI3r33ub6F@cluster0.unukabv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
