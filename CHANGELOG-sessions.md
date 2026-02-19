# folk.codes Terminal — Session Changelog

> Compiled across multiple Claude Code sessions. Covers all features built, bugs fixed, and architectural decisions made.

---

## Session Arc 1 — Foundation & Games

### Screensaver System
- Built multiple screensavers (slideshow, matrix rain, etc.) with a screensaver manager
- CRT filter overlay with scanlines, phosphor glow, vignette
- Mini-monitor status indicator in the control panel

### Theme System
- 6 themes: Phosphor Green (default), Amber, Commodore 64, IBM Blue, Fallout Pip-Boy, Apple II
- All colors flow from CSS custom properties (`--t-primary`, `--t-primary-rgb`, `--t-glow`, etc.)
- Theme switcher accessible from control panel, persists state

### LCD Ticker
- Scrolling LCD ticker bar in the monitor bezel
- Configurable messages, theme-aware colors

### Command History
- Up/Down arrow key navigation through previous commands
- Stored in TerminalContext

### Conway's Game of Life (`life`, `conway`, `gameoflife`)
- Full canvas implementation with game-mode lifecycle
- Click to toggle cells, Space to pause, R to randomize, C to clear
- ESC to exit back to terminal

---

## Session Arc 2 — Wordle, Hangman, Help System

### Codeword (Wordle Clone) (`wordle`, `codeword`, `word`, `guess`)
- Renamed from "Wordle" to "CODEWORD" (accepts any 5-letter input, not dictionary-validated)
- 200+ embedded word list, random target each game
- Color-coded tiles: correct (green), present (yellow/gold), absent (dim)
- On-screen keyboard showing letter states
- Win/lose overlays with play-again
- **Help modal** (`?` key) with actual DOM tile examples using game CSS classes for theme-aware color demos
- Sections: CODEWORD rules, SIGNAL KEY with live colored tiles, STRATEGY, CONTROLS

### Hangman (`hangman`, `hang`, `gallows`)
- ASCII gallows with 7 progressive stages
- 90 tech-themed words
- On-screen A-Z keyboard with hit/miss coloring
- Help modal reusing shared styling
- Same game-mode lifecycle pattern

### Games List (`games`)
- Updated to include codeword, hangman in the games directory

---

## Session Arc 3 — Easter Egg Blitz

### Magic 8-Ball / Oracle (`8ball`, `oracle`)
- **Mystical orb aesthetic** — dark sphere with radial gradient, NOT NASA-box style
- Twinkling star background
- Glowing pyramid tribute behind the orb (CSS triangles with blur, pulsing animation)
- Orb shows YES/NO/?? with color-coded glow (green/red/amber)
- 21 answers categorized by sign type
- Shake animation with busyRef guard (prevents race conditions)
- **Idle prompt cycler** — when no answer shown, cycles through meditative instructions: "CONCENTRATE ON YOUR QUESTION...", "FOCUS YOUR MIND...", etc. with fade animation every 3 seconds

### Cowsay (`cowsay`, `cow`, `moo`)
- Classic cowsay ASCII art with dynamically-sized speech balloon
- 15 tech humor quotes, random each invocation
- `padEnd()` for consistent balloon alignment

### Classified Documents (`classified`, `redacted`, `secret`)
- 4 random top-secret redacted documents
- Flicker animation on load
- Programmatic padding with `p()` helper for perfect alignment

### Tarot Reading (`tarot`, `reading`, `mystic`)
- 22 Major Arcana with programmer-themed meanings
- 3-card spread (Past / Present / Future) with flip animation
- *Note: User says text too small to read — "pinned" for future session rework*

### Star Wars Crawl (`starwars`, `star wars`, `episode`, `jedi`)
- CSS perspective crawl animation (55-second scroll)
- Parody about rebel developers vs Corporate Framework Empire
- Gold text on starfield, game-mode with ESC exit

### Jurassic Park (`jurassic`, `jurassic park`, `nedry`, `newman`, `magic word`)
- Nedry hacking scene: phased typewriter showing "ACCESS DENIED" sequence
- Spam phase: "YOU DIDN'T SAY THE MAGIC WORD!" flooding the screen
- **BSOD blue (#0000aa)** background regardless of active theme
- Animated GIF in upper-right corner (`/images/ah-JP.gif`)
- **CTRL+C easter egg within the easter egg**: stops the spam, shows green terminal text with "this is a UNIX system" reference and Dodgson quote
- ESC to exit at any point

### Stardate / Time (`date`, `time`, `stardate`)
- Canvas-based hyperspace warp animation (star streaks rushing past)
- Fade-in readout overlay with:
  - Earth time (localized)
  - Stardate (calculated)
  - Unix epoch
  - Cosmic age (13.8B years)
- Ford Prefect quote: "Time is an illusion. Lunchtime doubly so."

### Desert Solitaire / Edward Abbey (`abbey`, `desert`, `solitaire`, `edward abbey`)
- Full canvas-rendered desert landscape at twilight
- Gradient sky (deep blue → purple → orange at horizon)
- Twinkling stars (120 stars with individual twinkle speeds)
- Saguaro cactus silhouettes with arms
- Mesa/butte formations on the horizon
- Abbey quotes fade in and out, cycling through 10 of his most powerful lines
- Attribution: "EDWARD ABBEY, 1927–1989 — DESERT SOLITAIRE"
- ESC to exit (game mode)

### Hayduke Lives! (`hayduke`, `hayduke lives`, `monkeywrench`, `monkey wrench`)
- Same desert scene as Abbey tribute, but after 8 seconds of peace...
- **Phase 1 — Glitch**: Red scanline glitches begin flickering across the screen
- **Phase 2 — Sabotage**: Hayduke's mission log scrolls: billboards removed, survey stakes pulled, bulldozers sugared, dams "objected to" — each line gets a green "DONE."
- **Phase 3 — Graffiti**: "HAYDUKE LIVES!" in bold red with glow, spray-paint drip effects, tilted like graffiti. "Always pull up survey stakes."
- Full tribute to _The Monkey Wrench Gang_

### Inline Bash Eggs (varied styles, NOT all NASA-box)
| Command | Style | Description |
|---------|-------|-------------|
| `sudo` | NASA box | Security access denied, location triangulated joke |
| `whoami` | NASA box | Identity analysis — concludes "YOU ARE FOLK" |
| `ping` | NASA box | Signal reflection, RTT, packet humor |
| `xyzzy`/`plugh` | NASA box | Colossal Cave Adventure reference |
| `rm`/`delete` | NASA box | Deletion intercepted, files "too important" |
| `hello world` | NASA box | First contact established, Genesis complete |
| `ls`/`dir` | Green listing | Fake directory with `.secrets/`, `hack_the_planet.sh`, empty `regrets/` |
| `cat` | Playful | ASCII cat art + "you didn't specify a file" |
| `man` | Manpage style | Fake manpage, "conforms to CHAOS", "see also: touch grass(1)" |
| `pwd` | Bold one-liner | `/home/folk/the-internet/a-cool-terminal/right-here` |
| `exit`/`quit`/`logout` | Italic, spooky | Hotel California — "you can never leave" |
| `uptime` | Compact stat | Random uptime, load average always 0.42 |
| `vi`/`vim`/`nano`/`emacs` | Pulsing glow | "You cannot leave. You have always been here." Editor-specific jokes |
| `curl`/`wget` | HTTP response | Fetches meaning of life, `X-Answer: 42`, Hitchhiker's reference |

---

## Session Arc 4 — Labyrinth Overhaul

### Color Overhaul
- Changed from green phosphor to **amber color scheme** (#ffb000)
- Ceiling, floor, walls, minimap, HUD, crosshair, vignette all amber

### Gallery of Illusions
- Dead-end detection via post-generation scan (open cells with exactly 1 open neighbor)
- Wall opposite the dead end's opening marked with art type (map values 2-6)
- **5 procedural art patterns** rendered as framed paintings:
  1. Sierpinski carpet (fractal)
  2. Spiral (optical illusion)
  3. Checkerboard
  4. Diamond waves
  5. Concentric circles (moiré)
- Gold frames around each painting
- **Performance**: Pre-rendered to 64x64 offscreen canvases via `ImageData`, then texture-mapped with `drawImage` column blitting (not per-pixel `fillRect`)

### Minimap Improvements
- Cell size: 4px → 6px
- Opacity: 0.35 → 0.7
- Brighter colors, player dot 3px with thicker direction line
- Gallery walls visible as brighter spots
- Goal pulses gold on minimap

### Dark Maze + Light Switch
- Maze starts very dark (steep distance falloff: `distMult = 1.45`)
- **Light switch** placed at ~40% of max BFS distance from start
- Glowing beacon visible in the dark (flickering radial gradient projected into 3D)
- Walking over it triggers:
  - `lightsOn = true`, `switchFlash = 1` (white flash overlay)
  - Light level animates smoothly from 0 → 1
  - Distance falloff eases to `0.25` (full visibility)
- HUD shows "FIND THE LIGHT SWITCH" until activated

### Goal / Victory
- BFS finds the farthest dead end from start position
- Marked as `CELL_GOAL` (value 9) — pulsing golden beacon column projected into 3D
- Walking into it triggers victory overlay:
  - Fade-in black overlay
  - "YOU FOUND IT" in gold with glow
  - "THE GALLERY OF ILLUSIONS REVEALS ITS FINAL SECRET"
  - "NOT ALL WHO WANDER ARE LOST... BUT YOU WERE."
  - Blinking "[ ESC TO EXIT ]"

### Mouse Look (Pointer Lock API)
- Click canvas to capture mouse cursor
- `mousemove` → `e.movementX` drives rotation
- Sensitivity: 0.003
- ESC releases pointer lock + exits game mode
- Proper cleanup on unmount

### Movement Improvements
- Speed: 0.045 → 0.06, rotation: 0.035 → 0.045
- Wall-slide collision with 0.1 radius
- `canMove()` checks all 4 corners of player bounding box
- Falls back to per-axis sliding when diagonal blocked

---

## Infrastructure & Utilities

### ASCII Box Utility (`client/src/utils/asciiBox.js`)
- `nasaBox(title, subtitle, lines, width?)` — standard NASA-report bordered box
- `simpleBox(lines, width?)` — thin-bordered box
- `padLine(text, width?)` — single padded line
- Uses `padEnd()` for guaranteed alignment (solved persistent ASCII misalignment issues)

### Inline `nasaBox()` Helper (Terminal.js)
- Local helper at top of Terminal.js for inline NASA boxes
- `const W = 58; const pad = (s) => ...`
- All inline NASA boxes converted to use this

### CSS Organization
- Bash egg styles grouped under `/* BASH COMMAND EGGS */` section
- Each has unique personality (pulsing vim, italic exit, compact uptime, etc.)

---

## Key Bug Fixes

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| 8-Ball never reveals answer | Multiple `useEffect` hooks watching `phase` state → React race conditions | Rewrote to single `shake()` callback with nested `setTimeout` + `busyRef` guard |
| ASCII boxes misaligned | Hand-aligned template literals had inconsistent line widths | Created `nasaBox()` helper with `padEnd()` for programmatic alignment |
| Duplicate 'crawl' case | Was already used by Roguelike | Changed Star Wars to use 'jedi' instead |
| Labyrinth extreme lag | Gallery walls rendered pixel-by-pixel (`fillRect` per pixel) | Pre-render art to offscreen canvases, blit with `drawImage` |
| Labyrinth getting stuck | Wall-slide collision margin too large (0.15), 4-corner check too strict | Reduced to 0.1, simplified slide logic |
| Labyrinth mouse inverted | Negated `movementX` | Removed negation |

---

## Architecture Notes

### Game Component Pattern
All game-mode components follow this lifecycle:
```
useEffect → enterGameMode() / return exitGameMode()
useEffect → setup canvas, keyboard, game loop / return cleanup
ESC → exitGameMode()
```

### State Management Pattern
- Mutable game state in plain variables (not React state) for performance
- `useRef` for values that need to survive re-renders without triggering them
- `setTick(t => t + 1)` pattern when React re-renders are needed
- `busyRef` guard pattern for preventing concurrent animations

### Import Convention
- Webpack won't resolve bare directory imports — always `'./commands/index'` not `'./commands'`

### Audio
- Global mute via `speakerMuted`/`setSpeakerMuted` in TerminalContext
- CageMatch pattern: `mutedRef.current = localMuted || speakerMuted`

---

## Notes for Next Session

### User Preferences
- **NEVER run git commands** — user manages git themselves
- Likes creative, weird, surprising eggs — "get weird with it"
- Not all eggs need NASA-box style — variety is important
- Values aesthetic polish — alignment, colors, readability matter
- Tests things manually in the browser

### Pinned / Deferred Work
- **Tarot**: Too small to read on screen. Needs rework — larger cards, better layout. User wants to incorporate the reveal/flip effect into the Roguelike game.
- **Roguelike forest mode**: User has an idea for a forest-themed roguelike based on **Medicine Cards** (Native American animal spirit guide oracle deck). No details discussed yet — bring it up in next session.
- **Rogue updates**: No roguelike code changes were made in these sessions. The existing Roguelike (`client/src/components/terminal/commands/Roguelike.js`) is a canvas-based dungeon crawler. Ready for expansion.

### Technical Debt
- `asciiBox.js` utility exists but isn't used by all components yet (Cowsay, Classified still use inline padding). Could migrate them over.
- Some eslint warnings about missing dependency arrays in useEffect hooks (harmless, intentional for game components).
- `Stardate.js` stars array is recreated on every mount — could be memoized.

### Files Modified in These Sessions
```
CREATED:
  client/src/utils/asciiBox.js
  client/src/components/terminal/commands/WordleGame.js
  client/src/components/terminal/commands/HangmanGame.js
  client/src/components/terminal/commands/EightBall.js
  client/src/components/terminal/commands/Cowsay.js
  client/src/components/terminal/commands/Classified.js
  client/src/components/terminal/commands/Tarot.js
  client/src/components/terminal/commands/StarWars.js
  client/src/components/terminal/commands/JurassicPark.js
  client/src/components/terminal/commands/Stardate.js
  client/src/components/terminal/commands/DesertSolitaire.js
  client/src/components/screensaver/ (directory)
  client/public/images/hhgttg/ (directory)

MODIFIED:
  client/src/components/terminal/Terminal.js (heavily — imports, switch cases, inline eggs)
  client/src/components/terminal/commands/index.js
  client/src/components/terminal/commands/Help.js
  client/src/components/terminal/commands/Games.js
  client/src/components/terminal/commands/Labyrinth.js (complete rewrite)
  client/src/context/TerminalContext.js
  client/src/pages/home/Home.js
  client/src/styles.css (hundreds of lines added)
```
