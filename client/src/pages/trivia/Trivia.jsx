import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../utils/Modal';
export default function Trivia() {
  const [game, setGame] = useState({});
  const [q, setQ] = useState('');
  useEffect(() => {
    const processResults = (result) => {
      let categories = {};

      result.forEach((clue) => {
        // if category in not in the object yet, add it
        if (!categories[clue.category.title]) {
          categories[clue.category.title] = {};
          categories[clue.category.title].values = [];
        }

        // if value doesnt exist in category, add it
        if (!categories[clue.category.title][clue.value] && clue.value) {
          categories[clue.category.title].values.push(clue.value);
        }
      });
      // filter out categories that do not have all of the values (the values array should always have a length of 5 (200, 400, 600... ))
      const validCategories = Object.keys(categories).filter((category) => {
        const values = categories[category].values;
        console.log('VALUES', values.length);
        return values.length === 5;
      });

      // Only want 6 categories for each gamme
      const gameOne = validCategories.slice(0, 6);

      let gameBoard = {};

      // gameboard is going to be an object of 6 child objects with category title as parent of each child
      // loop through the initial result and matched titles create new object with the question and answer as a child object of their value

      gameOne.forEach((category) => {
        gameBoard[category] = {};

        for (const clue of result) {
          if (clue.category.title === category) {
            gameBoard[category][clue.value] = {
              question: clue.question,
              answer: clue.answer,
            };
          }
        }
      });

      setGame(gameBoard);
    };

    const fetchBoard = async () => {
      const res = await axios.get('https://jservice.io/api/clues');
      const result = await res.data;

      sessionStorage.setItem('game-one', JSON.stringify(result));
      processResults(result);
    };
    fetchBoard();
  }, []);

  const handleClick = (e) => {
    console.log(e.target);
    let q = e.target.getAttribute('data-question');
    setQ(q);
    console.log(q);
  };
  return (
    <div>
      {Object.keys(game).map((category, i) => (
        <div key={category} className={'cat-' + (i + 1)}>
          <h1>{category}</h1>

          {Object.keys(game[category]).map((value) => (
            <div
              key={value}
              className={'value value-' + value}
              data-question={game[category][value].question}
              data-answer={game[category][value].answer}
              onClick={handleClick}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
      {q}
    </div>
  );
}
