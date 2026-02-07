# Fallout Game Sound Effects

This directory contains sound effects for the Fallout password hacking game.

## Required Sound Files

Place the following MP3 files in this directory:

1. **type.mp3** - Subtle typing/selection sound (plays when hovering over characters)
2. **select.mp3** - Click sound (plays when selecting a password)
3. **error.mp3** - Error/buzzer sound (plays on wrong password)
4. **success.mp3** - Success chime (plays on correct password)
5. **special.mp3** - Special activation sound (plays when activating bracket specials)

## Where to Get Sounds

You can:
- Create your own using audio editing software
- Find free sound effects from:
  - https://freesound.org/
  - https://mixkit.co/free-sound-effects/
  - https://www.zapsplat.com/
- Extract them from Fallout game files (for personal use only)

## Sound Requirements

- Format: MP3
- Duration: 0.1 - 0.5 seconds (short and punchy)
- Volume: Will be set to 30% in code, so use normalized audio
- Style: Retro computer/terminal sounds work best

## Note

The game will function without sounds - they're optional enhancements. The code includes error handling for missing sound files.
