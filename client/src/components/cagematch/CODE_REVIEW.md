# 🔍 Cagematch Code Review & Issues

## Critical Bugs Found

### 🐛 1. **Dependency Array Issue** (Lines 142-210)
**Problem**: The useEffect that handles card matching has a dangerous dependency array:
```javascript
}, [selectedCards, consecutiveMatches, cardsDealt, maxLives]);
```

**Issue**: `cardsDealt` changes when cards match (line 182), which could cause the effect to re-run while the modal is still showing. This might be causing the double sound.

**Fix**: Remove `cardsDealt` from dependencies and use useRef or restructure the logic.

---

### 🔊 2. **Deal Sound Spam** (Lines 218-233)
**Problem**: Plays a sound for EVERY card dealt (30 cards × 100ms = 3 seconds of rapid beeping)
```javascript
const dealInterval = setInterval(() => {
  setCardsDealt((prevCardsDealt) => {
    playSound(dealSound); // PLAYS 30 TIMES!
```

**Fix**: Either:
- Play sound once at start of deal
- Play sound every 5th card
- Remove deal sound entirely

---

### ⏱️ 3. **No setTimeout Cleanup** (Multiple locations)
**Problem**: If user exits game (ESC) while modal is showing, setTimeout still fires
```javascript
setTimeout(() => {
  setShowModal(false); // Component might be unmounted!
}, 450);
```

**Fix**: Store timeout IDs and clear them in cleanup:
```javascript
useEffect(() => {
  const timeouts = [];
  
  if (selectedCards.length === 2) {
    timeouts.push(setTimeout(() => { ... }, 400));
    timeouts.push(setTimeout(() => { ... }, 1500));
  }
  
  return () => timeouts.forEach(clearTimeout);
}, [selectedCards]);
```

---

### 🎯 4. **Consecutive Matches Bug** (Lines 186-188)
**Problem**: Checks `consecutiveMatches === 2` but just incremented it
```javascript
setConsecutiveMatches((prevMatches) => prevMatches + 1);

if (consecutiveMatches === 2) { // Uses OLD value, not new!
  handleStreak();
}
```

**Fix**: Use callback or check the updated value:
```javascript
setConsecutiveMatches((prevMatches) => {
  const newCount = prevMatches + 1;
  if (newCount === 3) {
    handleStreak();
  }
  return newCount;
});
```

---

### 🔄 5. **Frozen Cards Not Working Properly**
**Problem**: Cards have `isFrozen` prop but it only prevents flip-back timeout, not actual flipping

**Current**:
```javascript
if (!card.isMatched && isFlipped && isDisabled && !flipAllCards && !isFrozen) {
  setTimeout(() => {
    setIsFlipped(false);
  }, 1000);
}
```

**Issue**: Cards still flip back because the timeout from the original flip still runs.

**Fix**: Clear the timeout when frozen:
```javascript
useEffect(() => {
  if (isFrozen) return; // Don't set any timeouts
  
  let timeout;
  if (!card.isMatched && isFlipped && isDisabled && !flipAllCards) {
    timeout = setTimeout(() => setIsFlipped(false), 1000);
  }
  return () => clearTimeout(timeout);
}, [isFrozen, card.isMatched, isFlipped, isDisabled, flipAllCards]);
```

---

## Performance Issues

### 🐌 1. **Functions Recreated Every Render**
**Problem**: `playSound`, `handleCardClick`, `exitGame` recreated every render

**Fix**: Wrap in `useCallback`:
```javascript
const playSound = useCallback((audio) => {
  if (!muted) {
    audio.currentTime = 0;
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }
}, [muted]);
```

---

### 🐌 2. **Audio Elements Array Never Cleaned**
**Problem**: `audioElements` state grows forever (line 111)
```javascript
setAudioElements((prevAudio) => [
  ...prevAudio,
  { audio, isPlaying: true },
]);
```

**Fix**: This array serves no purpose - remove it or clean it up.

---

## UX/Polish Issues

### 🎨 1. **Card Deal Too Slow**
100ms × 30 cards = 3 full seconds before you can play

**Options**:
- Faster: 50ms (1.5 seconds)
- Instant: Show all cards at once
- Progressive: Deal in batches

---

### 🎨 2. **Modal Timing Could Be Faster**
Current: 400ms reveal + 1500ms view + 450ms fade = 2.35 seconds per pair

**Suggestion**:
- 300ms reveal
- 1000ms view (plenty of time to see match/no-match)
- 400ms fade
- Total: 1.7 seconds (28% faster)

---

### 🎨 3. **Streak Detection Off By One**
Checks for `consecutiveMatches === 2` but that's only 2 matches, not 3

**Fix**: Change to `=== 3` or adjust the logic

---

## Suggested Refactor

### Clean Up State
Remove unused/redundant state:
- `audioElements` - not used for anything
- `resetCards` - could be simplified
- `totalTime` - just use `timer`

### Simplify Modal Logic
Instead of 3 nested setTimeout:
```javascript
const REVEAL_TIME = 300;
const VIEW_TIME = 1000;
const FADE_TIME = 400;

setTimeout(() => setIsMatch(matched), REVEAL_TIME);
setTimeout(() => setModalFadingOut(true), REVEAL_TIME + VIEW_TIME);
setTimeout(() => clearAllState(), REVEAL_TIME + VIEW_TIME + FADE_TIME);
```

### Better Sound Management
```javascript
const sounds = {
  deal: new Audio('/sounds/cagematch/deal.wav'),
  flip: new Audio('/sounds/cagematch/flip.wav'),
  match: new Audio('/sounds/cagematch/collect-point-01.wav'),
  miss: new Audio('/sounds/cagematch/hit-01.wav'),
};

const playSound = (soundName) => {
  if (muted) return;
  const audio = sounds[soundName];
  audio.currentTime = 0;
  audio.volume = 0.2;
  audio.play().catch(() => {});
};
```

---

## Quick Wins (Priority Fixes)

1. **Fix dependency array** - Remove `cardsDealt`
2. **Fix deal sound** - Play once, not 30 times
3. **Add setTimeout cleanup** - Prevent errors on unmount
4. **Fix consecutive matches** - Use callback to check new value
5. **Speed up timing** - 300/1000/400 instead of 400/1500/450

---

## Test Cases to Verify

- [ ] Match sound plays exactly once per match
- [ ] No sounds/errors when pressing ESC during modal
- [ ] Streak triggers after 3 consecutive matches (not 2)
- [ ] Cards don't flash/flicker during transitions
- [ ] Game doesn't lag with rapid clicking
- [ ] Deal sound isn't overwhelming

Would you like me to implement these fixes?
