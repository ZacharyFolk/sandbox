import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const WORDS = [
  'about','above','abuse','actor','acute','admit','adopt','adult','after','again',
  'agent','agree','ahead','alarm','album','alert','alien','align','alive','allow',
  'alone','along','alter','among','angel','anger','angle','angry','apart','apple',
  'apply','arena','argue','arise','armor','array','aside','asset','audit','avoid',
  'award','aware','badly','baker','basic','basis','beach','begin','being','below',
  'bench','bible','birth','black','blade','blame','bland','blank','blast','blaze',
  'bleed','blend','blind','block','blood','bloom','blown','board','bonus','boost',
  'bound','brain','brand','brave','bread','break','breed','brick','bride','brief',
  'bring','broad','broke','brown','brush','buddy','build','bunch','burst','buyer',
  'cabin','candy','cargo','carry','catch','cause','chain','chair','charm','chart',
  'chase','cheap','check','chess','chest','chief','child','chunk','civic','claim',
  'class','clean','clear','click','cliff','climb','cling','clock','clone','close',
  'cloud','coach','coast','corps','couch','could','count','court','cover','crack',
  'craft','crash','crazy','cream','crime','cross','crowd','crown','cruel','crush',
  'curve','cycle','daily','dance','debut','decay','delay','delta','dense','depth',
  'devil','diary','dirty','ditch','doubt','dough','draft','drain','drama','drank',
  'drawn','dream','dress','dried','drift','drill','drink','drive','droit','drone',
  'drove','dying','eager','early','earth','eight','elder','elect','elite','empty',
  'enemy','enjoy','enter','entry','equal','error','essay','event','every','exact',
  'exile','exist','extra','faint','faith','false','fancy','fatal','fault','feast',
  'fever','fewer','fiber','field','fifth','fifty','fight','final','first','fixed',
  'flame','flash','flesh','float','flood','floor','flour','fluid','flush','focal',
  'focus','force','forge','forth','forum','found','frame','frank','fraud','fresh',
  'front','froze','fruit','giant','given','glass','globe','gloom','glory','going',
  'grace','grade','grain','grand','grant','graph','grasp','grass','grave','great',
  'green','grill','grind','grip','gross','group','grove','grown','guard','guess',
  'guest','guide','guild','guilt','habit','happy','harsh','haven','heart','heavy',
  'hence','herb','honor','horse','hotel','house','human','humor','ideal','image',
  'imply','index','inner','input','irony','issue','ivory','joint','joker','judge',
  'juice','juicy','known','label','labor','large','laser','later','laugh','layer',
  'learn','lease','least','leave','legal','lemon','level','light','limit','linen',
  'liver','local','lodge','logic','login','loose','lover','lower','loyal','lucky',
  'lunch','lying','magic','major','maker','march','match','mayor','media','mercy',
  'merit','metal','meter','might','minor','minus','model','money','month','moral',
  'motor','mount','mouse','mouth','movie','muddy','music','naive','nerve','never',
  'newly','night','noble','noise','north','noted','novel','nurse','ocean','offer',
  'often','orbit','order','organ','other','ought','outer','oxide','ozone','paint',
  'panel','panic','paper','parts','party','paste','patch','pause','peace','pearl',
  'penny','phase','phone','photo','piano','piece','pilot','pitch','pixel','pizza',
  'place','plain','plane','plant','plate','plaza','plead','plumb','plump','point',
  'poker','polar','pound','power','press','price','pride','prime','print','prior',
  'prize','probe','prone','proof','proud','prove','pupil','queen','query','quest',
  'queue','quick','quiet','quite','quota','quote','radar','radio','raise','rally',
  'range','rapid','ratio','reach','ready','realm','rebel','refer','reign','relax',
  'reply','rider','ridge','rifle','right','rigid','rival','river','robin','robot',
  'rocky','roman','rough','round','route','royal','rugby','ruler','rural','saint',
  'salad','sauce','scale','scene','scope','score','sense','serve','seven','shade',
  'shaft','shake','shall','shame','shape','share','shark','sharp','sheep','sheer',
  'sheet','shelf','shell','shift','shine','shirt','shock','shoot','shore','short',
  'shout','sight','since','sixth','sixty','sized','skill','skull','slate','sleep',
  'slice','slide','slope','smart','smell','smile','smoke','solar','solid','solve',
  'sorry','sound','south','space','spare','spark','speak','speed','spend','spent',
  'spill','spine','spite','split','spoke','spoon','sport','spray','squad','stack',
  'staff','stage','stain','stake','stale','stall','stamp','stand','stare','stark',
  'start','state','steak','steal','steam','steel','steep','steer','stern','stick',
  'still','stock','stone','stood','store','storm','story','stove','strip','stuck',
  'study','stuff','style','sugar','suite','super','surge','swamp','swear','sweep',
  'sweet','swept','swift','swing','sword','swore','swung','table','taste','teach',
  'teeth','theme','there','thick','thing','think','third','thorn','those','three',
  'threw','throw','thumb','tight','timer','title','toast','today','token','tooth',
  'topic','total','touch','tough','tower','toxic','trace','track','trade','trail',
  'train','trait','trash','treat','trend','trial','tribe','trick','tried','troop',
  'truck','truly','trump','trunk','trust','truth','tumor','twice','twist','ultra',
  'under','unify','union','unite','unity','until','upper','upset','urban','usage',
  'usual','valid','valor','value','valve','video','vigor','viral','virus','visit',
  'vista','vital','vivid','vocal','voice','voter','waist','waste','watch','water',
  'weary','weave','weird','wheat','wheel','where','which','while','white','whole',
  'whose','wider','witch','woman','world','worry','worse','worst','worth','would',
  'wound','wrath','write','wrote','yield','young','youth',
];

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function evaluateGuess(guess, target) {
  const result = Array(WORD_LENGTH).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  // First pass: mark correct
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = null;
      guessLetters[i] = null;
    }
  }

  // Second pass: mark present
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === null) continue;
    const idx = targetLetters.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = 'present';
      targetLetters[idx] = null;
    }
  }

  return result;
}

export default function WordleGame() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const [quit, setQuit] = useState(false);
  const [tick, setTick] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef(null);

  const gameRef = useRef({
    target: WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
    board: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('')),
    states: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('empty')),
    letterStates: {},
    currentRow: 0,
    currentCol: 0,
    gameOver: false,
    won: false,
    message: '',
    shakeRow: -1,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      target: WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
      board: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('')),
      states: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('empty')),
      letterStates: {},
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      won: false,
      message: '',
      shakeRow: -1,
    };
    setTick(t => t + 1);
  }, []);

  const handleKey = useCallback((key) => {
    const gs = gameRef.current;
    if (gs.gameOver) {
      if (key === 'ENTER') resetGame();
      return;
    }

    if (key === 'BACKSPACE' || key === '⌫') {
      if (gs.currentCol > 0) {
        gs.currentCol--;
        gs.board[gs.currentRow][gs.currentCol] = '';
        setTick(t => t + 1);
      }
      return;
    }

    if (key === 'ENTER') {
      if (gs.currentCol < WORD_LENGTH) {
        gs.message = 'NOT ENOUGH LETTERS';
        gs.shakeRow = gs.currentRow;
        setTick(t => t + 1);
        setTimeout(() => { gs.shakeRow = -1; gs.message = ''; setTick(t => t + 1); }, 600);
        return;
      }

      const guess = gs.board[gs.currentRow].join('');
      const result = evaluateGuess(guess, gs.target);

      gs.states[gs.currentRow] = result;

      // Update keyboard letter states (best result wins: correct > present > absent)
      const priority = { correct: 3, present: 2, absent: 1 };
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = gs.board[gs.currentRow][i];
        const current = gs.letterStates[letter];
        if (!current || priority[result[i]] > priority[current]) {
          gs.letterStates[letter] = result[i];
        }
      }

      if (guess === gs.target) {
        gs.won = true;
        gs.gameOver = true;
        const messages = ['GENIUS', 'MAGNIFICENT', 'IMPRESSIVE', 'SPLENDID', 'GREAT', 'PHEW'];
        gs.message = messages[gs.currentRow] || 'SOLVED';
      } else if (gs.currentRow === MAX_GUESSES - 1) {
        gs.gameOver = true;
        gs.message = gs.target;
      }

      gs.currentRow++;
      gs.currentCol = 0;
      setTick(t => t + 1);
      return;
    }

    // Letter input
    if (/^[A-Z]$/.test(key) && gs.currentCol < WORD_LENGTH) {
      gs.board[gs.currentRow][gs.currentCol] = key;
      gs.currentCol++;
      setTick(t => t + 1);
    }
  }, [resetGame]);

  useEffect(() => {
    if (quit) {
      exitGameMode();
      return;
    }
    enterGameMode();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return; }
        setQuit(true);
        return;
      }
      if (e.key === '?' || e.key === 'F1') {
        setShowHelp(h => !h);
        return;
      }
      if (showHelp) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      exitGameMode();
    };
  }, [quit, showHelp, enterGameMode, exitGameMode, handleKey]);

  // Focus container on mount for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (quit) return null;

  const gs = gameRef.current;

  return (
    <div ref={containerRef} className="wordle-container" tabIndex={0}>
      <div className="wordle-title">C O D E W O R D</div>

      {gs.message && (
        <div className={`wordle-message ${gs.gameOver ? 'wordle-message--final' : ''}`}>
          {gs.message}
          {gs.gameOver && <div className="wordle-message-sub">PRESS ENTER TO PLAY AGAIN</div>}
        </div>
      )}

      <div className="wordle-board">
        {gs.board.map((row, r) => (
          <div key={r} className={`wordle-row ${gs.shakeRow === r ? 'wordle-row--shake' : ''}`}>
            {row.map((letter, c) => {
              const state = gs.states[r][c];
              const filled = letter !== '';
              const cls = [
                'wordle-tile',
                state !== 'empty' ? `wordle-tile--${state}` : '',
                filled && state === 'empty' ? 'wordle-tile--filled' : '',
              ].filter(Boolean).join(' ');
              return (
                <div key={c} className={cls}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="wordle-keyboard">
        {KEYBOARD_ROWS.map((row, r) => (
          <div key={r} className="wordle-keyboard-row">
            {row.map((key) => {
              const state = gs.letterStates[key] || '';
              const isWide = key === 'ENTER' || key === '⌫';
              return (
                <button
                  key={key}
                  className={`wordle-key ${state ? `wordle-key--${state}` : ''} ${isWide ? 'wordle-key--wide' : ''}`}
                  onClick={() => handleKey(key === '⌫' ? 'BACKSPACE' : key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="wordle-hint">? for help &nbsp;·&nbsp; ESC to exit</div>

      {showHelp && (
        <div className="wordle-help-overlay" onClick={() => setShowHelp(false)}>
          <div className="wordle-help-panel new-scroll" onClick={e => e.stopPropagation()}>
            <div className="wordle-help-text">
              <div className="wordle-help-section">CODEWORD</div>
              <div className="wordle-help-rule" />
              <p>Guess the five-letter code in six tries.</p>
              <p>Type any letter to fill a tile. Press Enter to submit your guess. Backspace to delete.</p>
              <p>After each guess, tiles change color to show how close you are:</p>

              <div className="wordle-help-section">SIGNAL KEY</div>
              <div className="wordle-help-rule" />

              <div className="wordle-help-example">
                <div className="wordle-help-tiles">
                  <div className="wordle-tile wordle-tile--correct">C</div>
                  <div className="wordle-tile wordle-tile--absent">R</div>
                  <div className="wordle-tile wordle-tile--absent">A</div>
                  <div className="wordle-tile wordle-tile--present">N</div>
                  <div className="wordle-tile wordle-tile--absent">E</div>
                </div>
                <div className="wordle-help-labels">
                  <span><span className="wordle-tile wordle-tile--correct wordle-help-swatch">&nbsp;</span> EXACT — right letter, right position</span>
                  <span><span className="wordle-tile wordle-tile--present wordle-help-swatch">&nbsp;</span> CLOSE — right letter, wrong position</span>
                  <span><span className="wordle-tile wordle-tile--absent wordle-help-swatch">&nbsp;</span> MISS — letter not in the word</span>
                </div>
              </div>

              <p>The on-screen keyboard tracks every letter you've tried. Colors update to show the best result for each letter across all guesses.</p>

              <div className="wordle-help-section">STRATEGY</div>
              <div className="wordle-help-rule" />
              <p>Start with common letters — CRANE, SLATE, AUDIO. If a letter glows gold, try it in a different spot. If it's dim, eliminate it.</p>
              <p>Five letters. Six chances. No mercy.</p>

              <div className="wordle-help-section">CONTROLS</div>
              <div className="wordle-help-rule" />
              <div className="wordle-help-controls">
                <span>A-Z ............. type a letter</span>
                <span>Backspace ....... delete last letter</span>
                <span>Enter ........... submit guess</span>
                <span>? or F1 ......... toggle this help</span>
                <span>Esc ............. exit to terminal</span>
              </div>
            </div>
            <button className="wordle-help-close" onClick={() => setShowHelp(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
