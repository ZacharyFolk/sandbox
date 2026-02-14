const router = require('express').Router();
const Score  = require('../models/Score');

// ─── Per-game sort + comparison config ────────────────────────────────────────
const GAME_CONFIG = {
  cagematch: {
    sort: { time: 1, hearts: -1 },      // fastest time wins; hearts break ties
    isBetter: (a, b) =>
      a.time < b.time || (a.time === b.time && a.hearts > b.hearts),
  },
  snake: {
    sort: { score: -1 },                // highest score wins
    isBetter: (a, b) => a.score > b.score,
  },
  tetris: {
    sort: { score: -1, lines: -1 },     // highest score wins; lines break ties
    isBetter: (a, b) =>
      a.score > b.score || (a.score === b.score && (a.lines || 0) > (b.lines || 0)),
  },
};

const getConfig = (game) => GAME_CONFIG[game] || null;

async function getTopScores(game) {
  const config = getConfig(game);
  return Score.find({ game }).sort(config.sort).limit(10).lean();
}

function qualifies(game, candidate, topScores) {
  const config = getConfig(game);
  if (topScores.length < 10) return true;
  return config.isBetter(candidate, topScores[topScores.length - 1]);
}

// ─── GET /api/leaderboard/:game ───────────────────────────────────────────────
router.get('/:game', async (req, res) => {
  const { game } = req.params;
  if (!getConfig(game)) {
    return res.status(400).json({ error: `Unknown game: ${game}` });
  }
  try {
    const scores = await getTopScores(game);
    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

// ─── POST /api/leaderboard/:game ──────────────────────────────────────────────
// Submits a score. Inserts if it makes the top 10, drops the lowest if the
// board is already full.
//
// Body shapes:
//   cagematch → { initials, time, hearts }
//   snake     → { initials, score }
//   tetris    → { initials, score, lines }
router.post('/:game', async (req, res) => {
  const { game }  = req.params;
  const payload   = req.body;

  if (!getConfig(game)) {
    return res.status(400).json({ error: `Unknown game: ${game}` });
  }
  if (!payload.initials || typeof payload.initials !== 'string') {
    return res.status(400).json({ error: 'initials required' });
  }

  try {
    const topScores = await getTopScores(game);

    if (!qualifies(game, payload, topScores)) {
      return res.status(200).json({ message: 'Score did not qualify' });
    }

    // Drop the current lowest entry to keep the board at exactly 10
    if (topScores.length >= 10) {
      await Score.findByIdAndDelete(topScores[topScores.length - 1]._id);
    }

    const newScore = new Score({ game, ...payload });
    await newScore.save();
    res.status(200).json({ message: 'Score added' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving score' });
  }
});

// ─── POST /api/leaderboard/:game/check ────────────────────────────────────────
// Pre-flight: returns { isBetter: bool } so the client can decide whether to
// show the initials entry UI before making the full submission.
router.post('/:game/check', async (req, res) => {
  const { game }  = req.params;
  const candidate = req.body;

  if (!getConfig(game)) {
    return res.status(400).json({ error: `Unknown game: ${game}` });
  }

  try {
    const topScores = await getTopScores(game);
    res.status(200).json({ isBetter: qualifies(game, candidate, topScores) });
  } catch (err) {
    res.status(500).json({ error: 'Error checking score' });
  }
});

module.exports = router;
