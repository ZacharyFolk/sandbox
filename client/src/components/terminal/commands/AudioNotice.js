import Typist from 'react-typist-component';

const MUTE_LINES = `
╔══════════════════════════════════════════╗
║   ▷╳  AUDIO SUBSYSTEM  —  MK-II        ║
╠══════════════════════════════════════════╣
║   STATUS  :  [[ MUTED ]]                ║
║   ROUTE   :  INTERRUPTED                ║
║   OUTPUT  :  SUSPENDED                  ║
╠══════════════════════════════════════════╣
║   *** UNIT OPERATING IN SILENT MODE *** ║
╚══════════════════════════════════════════╝`;

const UNMUTE_LINES = `
╔══════════════════════════════════════════════════════════════╗
║           ██  AUDIO SUBSYSTEM — CONTROL REPORT  ██          ║
║                  FOLK.CODES TERMINAL  MK-II                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   AUDIO SYSTEMS COMING ONLINE . . .  ████████████  100%      ║
║                                                              ║
║   ┌──────────────────────────────────────────────────┐       ║
║   │  OUTPUT CHANNEL  :  [[ ENABLED  ]]               │       ║
║   │  SIGNAL ROUTE    :  NOMINAL                      │       ║
║   │  SPEAKER STATUS  :  ▷))  ACTIVE                 │       ║
║   │  AUTH LEVEL      :  OPERATOR / CONFIRMED         │       ║
║   └──────────────────────────────────────────────────┘       ║
║                                                              ║
║   INITIATING AUDIO DIAGNOSTIC . . .                          ║
║                                                              ║
║   CHANNEL CHECK  . . .  [████████████████████]  PASS        ║
║   SIGNAL TEST    . . .  [████████████████████]  PASS        ║
║   OUTPUT TEST    . . .  [████████████████████]  PASS        ║
║                                                              ║
║   AUDIO TEST TONE IN:  3 . . .  2 . . .  1 . . .            ║
║                                                              ║
║   *** AUDIO — ONLINE ***                                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;

const AudioNotice = ({ muted, onDone }) => {
  return (
    <Typist typingDelay={1} cursor={null} onTypingDone={onDone}>
      <pre className="nasa-report">
        {muted ? MUTE_LINES : UNMUTE_LINES}
      </pre>
    </Typist>
  );
};

export default AudioNotice;
