const prod_path = 'https://api.folk.codes/api/leaderboard/tetris';
const dev_path  = 'http://localhost:9999/api/leaderboard/tetris';

const API_PATH = process.env.NODE_ENV === 'production' ? prod_path : dev_path;

export async function fetchLeaderBoardData({ setLeaderBoard }) {
  try {
    const response = await fetch(API_PATH);
    const data = await response.json();
    setLeaderBoard(data);
  } catch (error) {
    console.error('Error fetching tetris leaderboard:', error);
  }
}

export async function checkIfScoreIsBetter(score, lines) {
  try {
    const response = await fetch(API_PATH + '/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, lines }),
    });
    if (!response.ok) throw new Error('Check request failed');
    const data = await response.json();
    return data.isBetter;
  } catch (error) {
    console.error('Error checking tetris score:', error);
    return false;
  }
}

export async function writeNewScore(initials, score, lines) {
  try {
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score, lines }),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error submitting tetris score:', error);
    return 'Error adding new score';
  }
}
