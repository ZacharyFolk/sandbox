const prod_path = 'https://api.folk.codes/api/leaderboard/snake';
const dev_path  = 'http://localhost:9999/api/leaderboard/snake';

const API_PATH = process.env.NODE_ENV === 'production' ? prod_path : dev_path;

/**
 * Fetches the top 10 snake scores.
 * @param {function} setLeaderBoard - State setter to receive the scores array.
 */
export async function fetchLeaderBoardData({ setLeaderBoard }) {
  try {
    const response = await fetch(API_PATH);
    const data = await response.json();
    setLeaderBoard(data);
  } catch (error) {
    console.error('Error fetching snake leaderboard:', error);
  }
}

/**
 * Checks whether a score qualifies for the top 10 before prompting for initials.
 * @param {number} score - The player's score.
 * @returns {Promise<boolean>}
 */
export async function checkIfScoreIsBetter(score) {
  try {
    const response = await fetch(API_PATH + '/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    });
    if (!response.ok) throw new Error('Check request failed');
    const data = await response.json();
    return data.isBetter;
  } catch (error) {
    console.error('Error checking snake score:', error);
    return false;
  }
}

/**
 * Submits a new snake score to the leaderboard.
 * @param {string} initials - Up to 3 characters.
 * @param {number} score    - The player's score.
 * @returns {Promise<string>} Server response message.
 */
export async function writeNewScore(initials, score) {
  try {
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score }),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error submitting snake score:', error);
    return 'Error adding new score';
  }
}
