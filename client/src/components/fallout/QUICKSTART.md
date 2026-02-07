# 🎮 Quick Start - Fallout Password Game

## Try It Now!

1. Start your dev server: `npm start`
2. Type `password` in the terminal
3. Use arrow keys to navigate the cypher text
4. Press Enter to select a password
5. Find the correct password before running out of attempts!

## Command Aliases

All of these work:
- `password` ⭐ (recommended)
- `fallout`
- `robco`

## Controls

### Keyboard
- **Arrow Keys**: Navigate the cypher text
- **Enter**: Select password or special
- **ESC**: Exit game

### Mouse
- **Hover**: Highlight characters
- **Click**: Select password or special

## Tips

1. **Look for words**: Real passwords are hidden among garbage characters
2. **Use brackets**: Click on `[]`, `<>`, or `()` groups to:
   - Remove a dud password (most likely)
   - Reset your attempts to 4 (if lucky)
3. **Likeness is key**: After a wrong guess, the "Likeness" number tells you how many letters are in the correct position
4. **Process of elimination**: Use likeness to narrow down the correct password

## Example Game Flow

```
Welcome to ROBCO Industries (TM) Termlink
Password Required

Attempts remaining: ■ ■ ■ ■

0x0C42 !@#$HELLO$%^
0x0C48 &*()WORLD-_[
0x0C4E ]{}THINK<>\\|
...

> HELLO
> Entry denied
> Likeness=2

Attempts remaining: ■ ■ ■

> THINK
> Password accepted!

[Restart] [Exit terminal]
```

## Customization Options

Edit `/client/src/components/fallout/FalloutGame.js`:

```javascript
const MAX_LIVES = 4;        // Change number of attempts
const ROWS = 34;            // Change amount of cypher text
const CHARS_PER_ROW = 12;   // Change width

// In initGame() function:
const wordLength = 5;       // Change password length (4-7 works best)
```

## Adding Sound Effects

1. Get 5 MP3 files (see `/sounds/fallout/README.md`)
2. Name them: `type.mp3`, `select.mp3`, `error.mp3`, `success.mp3`, `special.mp3`
3. Place in `/client/public/sounds/fallout/`
4. Reload and enjoy audio feedback!

## Troubleshooting

**Game not appearing?**
- Check console for errors
- Make sure dev server restarted after adding files
- Verify Terminal.js imported FalloutGame

**Sounds not playing?**
- Sounds are optional, game works without them
- Check file paths in FalloutGame.js
- Verify MP3 files are in `/public/sounds/fallout/`

**Styling looks off?**
- Check that your site has `--color` and `--bg` CSS variables
- Adjust colors in `fallout.css`

## Integration Points

- **TerminalContext**: Used for gameMode (hides prompt)
- **Typist**: Used for intro/outro text animations  
- **Your CSS variables**: Uses `--color` and `--bg` for theming
- **Your sounds**: Can use existing key sounds from `/src/sounds/`

---

**Ready to hack? Type `password` and good luck! 🖥️✨**
