const express = require('express');
const {connect} = require('./connection');
const { insertScore } = require('./connection');

async function getLeaderboardData() {
  const db = await connect();
  const collection = db.collection('leaderboard');
  const leaderboardData = await collection.find().toArray();
  return leaderboardData;
}


async function getTopScores() {
  const db = await connect();
  const leaderboard = db.collection('leaderboard');
  return leaderboard.find().sort({ time: 1, hearts: -1 }).limit(10).toArray();
}

async function updateScoresIfNeeded(newScore) {
  const db = await connect();
  const leaderboard = db.collection('leaderboard');
  const topScores = await getTopScores();

  if (topScores.length < 10 || isNewScoreBetter(newScore, topScores[9])) {
    if (topScores.length >= 10) {
      await leaderboard.deleteOne({ _id: topScores[9]._id });
    }
    await leaderboard.insertOne(newScore);
  }
}

function isNewScoreBetter(newScore, existingScore) {
  if (!existingScore) {
  return true;
  } 
  return newScore.time < existingScore.time || (newScore.time === existingScore.time && newScore.hearts > existingScore.hearts);
}

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/api/leaderboard', async (req, res) => {
  const { initials, time, hearts } = req.body;
  try {
    await insertScore(initials, time, hearts);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error inserting score:', err);
    res.status(500).send('Error inserting score');
  }
});


app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await getTopScores();
    console.log('Leaderboard data:', leaderboardData);
    if (leaderboardData !== undefined) {
      res.status(200).json(leaderboardData);
  } else {
    throw new Error('Leaderboard data is undefined');
  }
  } catch (err) {
    console.error('Error fetching the leaderboard', err);
    res.status(500).send('Error fetching high scores');
  }
});



app.post('/api/leaderboard/check', async (req, res) => {
  const { time, hearts } = req.body;
  try {
    const topScores = await getTopScores();
    const newScore = { time, hearts };
    const isBetter = isNewScoreBetter(newScore, topScores[9]);
    res.json({ isBetter });
  } catch (err) {
    console.error('Error checking score:', err);
    res.status(500).send('Error checking score');
  }
});



app.listen(1999, () => {
  console.log('Server running on port 1999');
});
