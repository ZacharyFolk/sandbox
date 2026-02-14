import { useEffect, useState } from 'react';
import { fetchLeaderBoardData } from './tetrisUtils';

const TetrisLeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchLeaderBoardData({ setLeaderBoard });
      setLoading(false);
    };
    load();
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
              <th>Score</th>
              <th>Lines</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.initials}</td>
                <td>{entry.score}</td>
                <td>{entry.lines ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TetrisLeaderBoard;
