import { useEffect, useState } from 'react';

import axios from 'axios';
import './trivia.css';
export default function Trivia() {
  const [game, setGame] = useState({});
  const [score, setScore] = useState(0);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [input, setInput] = useState('');
  const [isActive, setActive] = useState('false');
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  const [currentValue, setCurrentValue] = useState(0);
  const levenshtein = require('fast-levenshtein');

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
      setActive(false);
      let localGame = JSON.parse(sessionStorage.getItem('game-one'));
      if (!localGame) {
        const res = await axios.get('https://jservice.io/api/clues');
        const result = await res.data;
        processResults(result);
      } else {
        setGame(localGame);
      }
    };
    fetchBoard();
  }, []);

  function parseString(str) {
    let unwantedWords = ['the', 'a', 'an'];
    let words = str.toLowerCase().split(/[^\w']+/);
    let filteredWords = words.filter((word) => !unwantedWords.includes(word));
    return filteredWords.join(' ');
  }
  const handleClick = (e) => {
    console.log(e.target);
    setActive(true);
    let q = e.target.getAttribute('data-question');
    let a = e.target.getAttribute('data-answer');
    let v = e.target.getAttribute('data-value');
    setCurrentValue(v);
    // filter answer to remove some words
    a = parseString(a);
    setQ(q);
    setA(a);
    console.log(q);
    console.log(a);
  };

  const handleKeys = (e) => {
    let code = e.keyCode;
    switch (code) {
      case 13:
        e.preventDefault();
        let typed = parseString(e.target.textContent);
        e.target.innerHTML = '';
        setInput(typed);

        break;
      default:
      // console.log('something else');
    }
  };

  const checkAnswer = () => {
    console.log('INPUT', input);
    console.log('ANSWER', a);
    const distance = levenshtein.get(input, a);
    let percentageMatch =
      (1 - distance / Math.min(input.length, a.length)) * 100;
    percentageMatch = Math.round(percentageMatch);
    if (percentageMatch > 70) {
      let newScore = parseInt(score) + parseInt(currentValue);
      setCorrect(true);
      setScore(newScore);
      setActive(false);
      setTimeout(() => {
        setCorrect(false);
      }, 2000);
      // fade result message after a few seconds
    } else {
      let newScore = parseInt(score) - parseInt(currentValue);
      setScore(newScore);
      setActive(false);
      setIncorrect(true);
      setTimeout(() => {
        setIncorrect(false);
      }, 2000);
    }
    setActive(false);
  };

  useEffect(() => {
    checkAnswer(input);
  }, [input]);

  return (
    <div className='about-container'>
      <div className='scoreBoard'>
        SCORE : <span>$</span>
        {score}
      </div>
      <div className='trivia-board'>
        {Object.keys(game).map((category, i) => (
          <div key={category} className={'cat-' + (i + 1)}>
            <h1>{category}</h1>

            {Object.keys(game[category]).map((value) => (
              <div
                key={value}
                className='value'
                data-value={value}
                data-question={game[category][value].question}
                data-answer={game[category][value].answer}
                onClick={handleClick}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={'correctamundo ' + (correct ? 'active' : 'inactive')}>
        <p className='alert'>Yes! That is correct for ${currentValue}!</p>
      </div>
      <div className={'nope ' + (incorrect ? 'active' : 'inactive')}>
        <p className='alert'>
          Sorry, that is incorrect. You lose -${currentValue}!
        </p>
      </div>
      <div className={'qaBox ' + (isActive ? 'active' : 'inactive')}>
        <div className='qaContent'>
          <div className='question'>{q}</div>
          <div className='answer'>
            <span>What is </span>
            <span
              className='terminal-input'
              contentEditable='true'
              suppressContentEditableWarning={true}
              onKeyDown={(e) => handleKeys(e)}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}
