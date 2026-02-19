import { useState, useEffect } from 'react';

const BW = 52;
const bbar = '═'.repeat(BW);
const bp = (s) => `║ ${s.padEnd(BW - 2)} ║`;
const TAROT_HEADER = [
  `╔${bbar}╗`,
  bp('  ██  DIVINATION ENGINE — 3 CARD SPREAD  ██'),
  bp('       FOLK.CODES TERMINAL MK-II'),
  `╠${bbar}╣`,
  bp(''),
  bp('THE TERMINAL PEERS INTO THE'),
  bp('DATASTREAM OF FATE...'),
  bp(''),
  `╚${bbar}╝`,
].join('\n');

const MAJOR_ARCANA = [
  { name: 'THE FOOL',           num: '0',    meaning: 'New beginnings, innocence, a leap into the unknown. The cursor blinks on an empty line.' },
  { name: 'THE MAGICIAN',       num: 'I',    meaning: 'Mastery of tools, willpower, creation. You have root access to your own destiny.' },
  { name: 'THE HIGH PRIESTESS', num: 'II',   meaning: 'Intuition, mystery, the subconscious. The answer is in the code you haven\'t read yet.' },
  { name: 'THE EMPRESS',        num: 'III',  meaning: 'Abundance, creativity, nurturing. Your side projects will bear fruit.' },
  { name: 'THE EMPEROR',        num: 'IV',   meaning: 'Structure, authority, stability. Time to refactor the architecture.' },
  { name: 'THE HIEROPHANT',     num: 'V',    meaning: 'Tradition, mentorship, convention. Read the documentation before asking.' },
  { name: 'THE LOVERS',         num: 'VI',   meaning: 'Choices, harmony, alignment. Your merge conflict will resolve itself.' },
  { name: 'THE CHARIOT',        num: 'VII',  meaning: 'Determination, momentum, victory. Ship it. Ship it now.' },
  { name: 'STRENGTH',           num: 'VIII', meaning: 'Courage, patience, inner power. The bug fears you more than you fear it.' },
  { name: 'THE HERMIT',         num: 'IX',   meaning: 'Solitude, reflection, inner guidance. Close Slack. Open your editor. Focus.' },
  { name: 'WHEEL OF FORTUNE',   num: 'X',    meaning: 'Cycles, change, destiny. The deployment pipeline spins in your favor.' },
  { name: 'JUSTICE',            num: 'XI',   meaning: 'Balance, fairness, truth. The tests don\'t lie.' },
  { name: 'THE HANGED MAN',     num: 'XII',  meaning: 'Suspension, letting go, new perspective. Step away from the screen. The answer will come.' },
  { name: 'DEATH',              num: 'XIII', meaning: 'Transformation, endings, rebirth. Delete the legacy code. It\'s time.' },
  { name: 'TEMPERANCE',         num: 'XIV',  meaning: 'Balance, moderation, patience. Don\'t over-engineer it.' },
  { name: 'THE DEVIL',          num: 'XV',   meaning: 'Bondage, materialism, shadow self. You\'re addicted to checking your analytics.' },
  { name: 'THE TOWER',          num: 'XVI',  meaning: 'Sudden change, upheaval, revelation. Production is down. But you will rebuild stronger.' },
  { name: 'THE STAR',           num: 'XVII', meaning: 'Hope, inspiration, serenity. The green build light shines for you.' },
  { name: 'THE MOON',           num: 'XVIII',meaning: 'Illusion, fear, the subconscious. That "quick fix" has hidden side effects.' },
  { name: 'THE SUN',            num: 'XIX',  meaning: 'Joy, success, vitality. All tests passing. All lights green. Bask in it.' },
  { name: 'JUDGEMENT',          num: 'XX',   meaning: 'Reflection, reckoning, absolution. Time for a code review — of your life.' },
  { name: 'THE WORLD',          num: 'XXI',  meaning: 'Completion, integration, accomplishment. Version 1.0 is ready. You did it.' },
];

function wrapMeaning(text, width) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > width) {
      lines.push(current.trim());
      current = w;
    } else {
      current = current ? current + ' ' + w : w;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export default function Tarot() {
  const [cards, setCards] = useState(null);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, 3));

    const t1 = setTimeout(() => setRevealed(1), 800);
    const t2 = setTimeout(() => setRevealed(2), 1800);
    const t3 = setTimeout(() => setRevealed(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!cards) return null;

  const positions = ['PAST', 'PRESENT', 'FUTURE'];

  return (
    <div className="tarot-container">
      <pre className="nasa-report tarot-header">{'\n' + TAROT_HEADER}</pre>

      <div className="tarot-spread">
        {cards.map((card, i) => (
          <div key={i} className={`tarot-card ${revealed > i ? 'tarot-card--revealed' : ''}`}>
            {revealed > i ? (
              <div className="tarot-card-face">
                <div className="tarot-position">{positions[i]}</div>
                <div className="tarot-numeral">{card.num}</div>
                <div className="tarot-name">{card.name}</div>
                <div className="tarot-meaning">
                  {wrapMeaning(card.meaning, 28).map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="tarot-card-back">
                <div className="tarot-back-pattern">
                  {'╬ ╬ ╬ ╬\n'.repeat(4)}
                  {'  ✦ ✦  \n'}
                  {'╬ ╬ ╬ ╬\n'.repeat(4)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
