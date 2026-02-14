# 🃏 Cagematch Integration - Quick Start

## ✅ What's Been Done

I've successfully integrated Cagematch into your terminal! Here's what I created:

### Components Created:
- ✅ `CageMatch.js` - Main game logic with Terminal integration
- ✅ `CageCard.js` - Individual card component
- ✅ `GameScreen.js` - Card grid display
- ✅ `CageHead.js` - Header with stats
- ✅ `WinScreen.js` - Victory screen with high score submission
- ✅ `FailScreen.js` - Game over screen
- ✅ `SoundOnIcon.js`, `SoundOffIcon.js`, `Eye.js` - UI icons
- ✅ `cardArray.js` - Card data
- ✅ `utils.js` - API utilities
- ✅ `cagematch.css` - Styling

### Terminal Integration:
- ✅ Added `cagematch` command (also works with: `cage`, `cards`, `match`)
- ✅ Integrated with TerminalContext (game mode + ESC to exit)
- ✅ Added to help menu
- ✅ Uses existing Terminal styling (--color, --bg variables)

## 📦 Assets You Need to Copy

### Images (15 card images + 2 special images):
Copy from: `C:\Users\Zac\Documents\SANDBOX\cagematch\client\public\cagematch_assets\images\`
To: `C:\WWW\sandbox\client\public\images\cagematch\`

**Files needed:**
- cage1.jpg through cage17.jpg (the 15 unique cards)
- cage6.jpg (matched state image)
- cage10.jpg (card back image)

### Sounds (optional but recommended):
Copy from: `C:\Users\Zac\Documents\SANDBOX\cagematch\client\public\cagematch_assets\sounds\`
To: `C:\WWW\sandbox\client\public\sounds\cagematch\`

**Files needed:**
- deal.wav
- flip.wav
- collect-point-01.wav (match sound)
- hit-01.wav (miss sound)
- shame-on-you.mp3 (game over)
- cage-thanks.mp3 (win sound)
- cage-bored.mp3 (low hearts)
- cage-bunny.mp3 (low hearts)
- am-i-getting-through-to-you.mp3 (low hearts)
- cage-declaration.mp3 (low hearts)

## 🚀 How to Play

1. **Start your dev server**: `npm start`
2. **Type command**: `cagematch` (or `cage`, `cards`, `match`)
3. **Play the game**:
   - Click cards to flip them
   - Match two identical Nicolas Cage faces
   - ❤ +1 heart for each match, -1 for each miss
   - 🔥 3 consecutive matches = unlock "peek" ability
4. **Press ESC** to exit anytime

## 🎮 Current Features

✅ Full visual card matching game
✅ 15 unique Nicolas Cage cards (30 total)
✅ Lives system (10 hearts)
✅ Timer tracking
✅ Streak detection (3 in a row = peek power-up)
✅ Win/lose screens
✅ High score submission (uses existing API)
✅ Mute toggle
✅ ESC to exit
✅ Mobile responsive grid

## 🔧 Next Steps (Future Enhancements)

### 1. Arrow Key Navigation (You Mentioned This!)
Currently mouse/click only. We can add:
- Arrow keys to highlight cards
- Enter to select
- Visual highlight on active card

### 2. Card Count Options
Currently uses all 15 pairs. We could:
- Add difficulty levels (Easy=8 pairs, Medium=12, Hard=15)
- Let player choose before starting

### 3. Flip & Grow Effect (MTG Arena style!)
- Card zooms/expands when flipped
- Smooth animations
- Maybe use a modal or overlay for the enlarged view

### 4. Generic Leaderboard API
- Extend `/api/routes/` to support multiple games
- Add game type to scores
- Unified leaderboard for Tetris, Cagematch, Fallout, etc.

## 🐛 Troubleshooting

**Game not loading?**
- Make sure you've copied the images to `/public/images/cagematch/`
- Check console for errors
- Verify dev server restarted

**Sounds not playing?**
- Sounds are optional - game works without them
- Copy sound files to `/public/sounds/cagematch/`
- Check browser console for 404 errors

**Cards look weird?**
- Check that image paths are correct
- Verify images are .jpg format
- Make sure cage6.jpg and cage10.jpg exist (special images)

## 🎯 Test It!

```bash
# In your terminal window, type:
cagematch

# Or any of these aliases:
cage
cards
match
```

## 📝 Notes

- **API**: Currently points to production API (`https://score-api.folk.codes/api/leaderboard`)
- **Styling**: Uses your site's CSS variables (--color, --bg)
- **Game Mode**: Properly integrated with TerminalContext (hides prompt, enables ESC)
- **No Title Screen**: Game starts immediately for faster gameplay in terminal

---

Ready to test? Copy the assets and type `cagematch`! 🎮

Let me know what enhancements you'd like to tackle first:
1. Arrow key navigation?
2. Flip & grow animation?
3. Different card counts/difficulty?
4. Generic leaderboard API?
