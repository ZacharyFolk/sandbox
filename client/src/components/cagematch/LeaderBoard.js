import { useEffect, useState } from 'react';
import { fetchLeaderBoardData, formatTime } from './utils';

export const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      await fetchLeaderBoardData({ setLeaderBoard });
      setLoading(false);
    };
    loadScores();
  }, []);

  return (
    <div className="cage-leaderboard">
      <h2>HIGH SCORES</h2>
      {loading ? (
        <div className="loading">Loading scores...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Time</th>
              <th>Hearts</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.initials}</td>
                <td>{formatTime(entry.time)}</td>
                <td>{entry.hearts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
