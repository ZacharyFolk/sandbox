const mongoose = require('mongoose');

// Shared leaderboard schema for all games.
// Fields that don't apply to a given game are simply omitted on write.
//
// cagematch → { game, initials, time, hearts }
// snake     → { game, initials, score }
// tetris    → { game, initials, score, lines }
const ScoreSchema = new mongoose.Schema(
  {
    game: {
      type: String,
      required: true,
      enum: ['cagematch', 'snake', 'tetris'],
    },
    initials: {
      type: String,
      required: true,
      maxlength: 3,
      uppercase: true,
      trim: true,
    },
    // cagematch
    time:   { type: Number },
    hearts: { type: Number },
    // snake / tetris
    score:  { type: Number },
    // tetris only
    lines:  { type: Number },
  },
  { timestamps: true }
);

// Index for fast per-game queries
ScoreSchema.index({ game: 1 });

module.exports = mongoose.model('Score', ScoreSchema);
