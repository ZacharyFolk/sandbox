const prod_path = 'https://api.folk.codes/api/leaderboard/cagematch';
const dev_path  = 'http://localhost:9999/api/leaderboard/cagematch';

const API_PATH = process.env.NODE_ENV === 'production' ? prod_path : dev_path;

/**
 * Returns the high scores for cagematch
 * @param {function} setLeaderBoard - Function to set the high scores into a state
 * @returns {Promise<object>} A promise that resolves to a json object of the scores
 */
export async function fetchLeaderBoardData({ setLeaderBoard }) {
  try {
    const response = await fetch(API_PATH);
    const data = await response.json();
    setLeaderBoard(data);
  } catch (error) {
    console.error('Error fetching leaderboard data', error);
  }
}

/**
 * Checks if the new score (time and hearts) is better than the existing scores.
 * @param {number} time - The time of the new score.
 * @param {number} hearts - The number of hearts of the new score.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the new score is better.
 */
export async function checkIfScoreIsBetter(time, hearts) {
  try {
    const response = await fetch(API_PATH + '/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time, hearts }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data.isBetter;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

/**
 * Writes a new score (initials, time, and hearts) to the leaderboard.
 * @param {string} initials - The initials of the player.
 * @param {number} time - The time of the new score.
 * @param {number} hearts - The number of hearts of the new score.
 * @returns {Promise<string>} A promise that resolves to a string indicating the success message from the server.
 */
export async function writeNewScore(initials, time, hearts) {
  try {
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initials, time, hearts }),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error:', error);
    return 'Error adding new score';
  }
}

/**
 * Formats the given time in seconds to a HH:MM:SS format.
 * @param {number} time - The time in seconds to format.
 * @returns {string} The formatted time string in HH:MM:SS format.
 */
export const formatTime = (time) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
