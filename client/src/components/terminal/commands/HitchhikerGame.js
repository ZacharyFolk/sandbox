import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ─── BBC GUIDE IMAGES ────────────────────────────────────────────────────────
const GUIDE_IMAGES = [
  '/images/hhgttg/hhgttg-1.gif',
  '/images/hhgttg/hhgttg-2.gif',
  '/images/hhgttg/hhgttg-3.gif',
  '/images/hhgttg/hhgttg-4.gif',
  '/images/hhgttg/hhgttg-5.gif',
  '/images/hhgttg/hhgttg-6.gif',
];

// ─── ROOM DEFINITIONS ────────────────────────────────────────────────────────

const TITLE_ART = `
                        .  *        .       .    *    .
           *    .    *        .   *    .        *
      .        .        *    .        .    .        .
   *     .  *     .        .     *        .   *
                   , ; ,   .-'"""'-.   , ; ,
                   \\\\|/  .'         '.  \\|//
                    \\-;-/             \\-;-/
                    // ;               ; \\\\
                   //__; :.         .; ;__\\\\
                  \`-----\\'.'-.....-'.'/-----'
                         '.'.-.-,_.'.'
            *              '(  (..-'        .
      .        .     *       '-'                *
           *        .    .        .   *    .

 ██╗  ██╗██╗████████╗ ██████╗██╗  ██╗██╗  ██╗██╗██╗  ██╗███████╗██████╗ ██╗███████╗
 ██║  ██║██║╚══██╔══╝██╔════╝██║  ██║██║  ██║██║██║ ██╔╝██╔════╝██╔══██╗██║██╔════╝
 ███████║██║   ██║   ██║     ███████║███████║██║█████╔╝ █████╗  ██████╔╝╚═╝███████╗
 ██╔══██║██║   ██║   ██║     ██╔══██║██╔══██║██║██╔═██╗ ██╔══╝  ██╔══██╗   ╚════██║
 ██║  ██║██║   ██║   ╚██████╗██║  ██║██║  ██║██║██║  ██╗███████╗██║  ██║   ███████║
 ╚═╝  ╚═╝╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚══════╝

   G U I D E   T O   T H E   G A L A X Y

   A TEXT ADVENTURE — AFTER DOUGLAS ADAMS & INFOCOM (1984)
   ─────────────────────────────────────────────────────────
   Type HELP for commands. Type QUIT to exit.
`;

const ROOMS = {
  bedroom: {
    name: "ARTHUR'S BEDROOM",
    descDark: `It is pitch dark. You are lying in bed in your darkened
bedroom. Your head hurts. A lot. The room is spinning, which
is odd because you're fairly sure rooms aren't supposed to do
that.

Thursday. It must be Thursday. You never could get the hang
of Thursdays.

You can hear the sound of a BULLDOZER outside.`,
    descLight: (fl) => `Your bedroom is a mess. Light streams in through the gap
in the curtains with the persistence of a Jehovah's Witness.

${fl.inBed ? 'You are lying in bed.' : ''}A DRESSING GOWN is draped over a chair, looking resigned.
A SCREWDRIVER and a TOOTHBRUSH sit on the shelf.
A PHONE sits on the small table, blinking reproachfully.
${fl.headache ? '\nYour head hurts. A lot.' : ''}
There is an exit to the SOUTH.`,
    onEnter: `You wake up. The world immediately presents you with a headache
of truly epic proportions — the kind of headache that suggests
your brain has been replaced with a small angry hedgehog.

This is not entirely unrelated to the six pints of bitter and
several gin and tonics you consumed last night at the Horse and
Groom with Ford Prefect. Ford said something odd. What was it?
Something about the end of the world. Probably nothing.

It is pitch dark.`,
  },
  porch: {
    name: "FRONT PORCH",
    description: `A small, cramped porch. JUNK MAIL is piled on the doormat.
The front door leads SOUTH outside. The stairs lead back
NORTH to your bedroom.`,
    onEnter: `You stumble downstairs to the front porch. Junk mail is
scattered across the doormat.`,
  },
  frontyard: {
    name: "FRONT OF HOUSE",
    description: (fl) => `You are standing in front of your house. Or rather, what is
currently your house. What will shortly be a bypass.

An enormous yellow BULLDOZER is parked on your front lawn,
looking smug. Mr. PROSSER, a large, round man in a hard hat,
is standing next to it with a clipboard and an expression that
suggests clipboards confer authority.

Behind him, several workmen are drinking tea and looking at your
house the way a surgeon might look at a particularly
straightforward appendectomy.
${fl.liedDown && !fl.fordArrived ? '\nYou are lying in front of the bulldozer. This is surprisingly comfortable for an act of civil disobedience.' : ''}${fl.fordArrived && fl.prosserLying ? "\nMr. Prosser is lying in front of the bulldozer, looking confused but strangely at peace. Ford is tugging your arm urgently toward the SOUTH." : ''}
Your house is to the NORTH.`,
    onEnter: `You step outside and immediately wish you hadn't.

An enormous yellow bulldozer is sitting on your front lawn with
the quiet confidence of something that knows exactly what it's
about to do. Mr. Prosser spots you.

"Ah, Mr. Dent," he says, "we were just about to knock your
house down."

"WHAT?!" you say.

"Yes, it's scheduled for demolition. The plans have been
available at the planning office for nine months."

"They were on display in the bottom of a locked filing cabinet
stuck in a disused lavatory with a sign on the door saying
'Beware of the Leopard.'"

Mr. Prosser looks uncomfortable. The bulldozer rumbles
impatiently.`,
  },
  pub: {
    name: "THE HORSE AND GROOM",
    description: (fl) => `The pub. The wonderful, glorious, beautifully mundane pub.

It smells of beer and peanuts and that particular pub smell that
scientists have never been able to identify but which probably
involves centuries of accumulated carpet stains.

FORD is sitting at a table looking unusually agitated. He has
ordered six pints of BEER. There is a CHEESE SANDWICH on the
counter and a bowl of PEANUTS on the bar.

Ford has placed a rather worn TOWEL on the table between you.
${fl.beerDrunk >= 3 ? '\nA distant crash echoes from the direction of your house. Or what used to be your house.' : ''}`,
    onEnter: `Ford grabs you by the arm and hauls you bodily toward the pub
with the kind of urgency usually reserved for people fleeing
natural disasters, which, as it turns out, is exactly what's
happening.

"Six pints of bitter, please," Ford tells the barman, "and
hurry. The world's about to end."

The barman nods. He's heard worse.

Ford pushes a pint toward you. "Three pints each," he says,
"plus muscle relaxant. That's the key."

"Ford," you say, "what exactly is going on?"

"Drink your beer and I'll explain."`,
  },
  lane: {
    name: "COUNTRY LANE",
    description: (fl) => `A quiet country lane stretching EAST-WEST. The pub is
to the WEST. The lane continues EAST toward your demolished
house.
${fl.dogAppeared && !fl.dogFed ? '\nA small, mangy DOG is here, yapping at you with unreasonable enthusiasm.' : ''}${fl.dogFed ? '\nA small dog is sleeping contentedly, surrounded by crumbs.' : ''}`,
    onEnter: `You stumble out of the pub into the country lane. The air
feels strange. Electric. Ford is looking at the sky with an
expression that suggests the sky is about to do something
deeply unpleasant.`,
  },
  vogon: {
    name: "THE SKY",
    description: '',
    onEnter: '',
  },
};

// ─── ITEM DESCRIPTIONS ──────────────────────────────────────────────────────

const ITEM_DESCRIPTIONS = {
  analgesic: "A small bottle of buffered analgesic. The label reads 'FOR HEADACHES, HANGOVERS, AND EXISTENTIAL DREAD.' Two out of three isn't bad.",
  gown: "A threadbare dressing gown of indeterminate color. It's the kind of garment that says 'I have given up, but tastefully.' The pocket bulges slightly.",
  phone: "Your phone. It's blinking with a notification from the local council planning department. It says 'DEMOLITION NOTICE — SEE PLANS FOR DETAILS.' The timestamp is nine months ago.",
  screwdriver: "A flat-headed screwdriver. You're not sure why it's on the shelf. You're not sure why most things are on the shelf.",
  toothbrush: "Your toothbrush. Green. Bristles slightly splayed. It has seen better days, much like yourself.",
  fluff: "Pocket fluff. The universe's most common export.",
  'thing your aunt gave you': "You're not entirely sure what it is. Your aunt gave it to you last Christmas. It might be decorative. It might be functional. It defies categorization, which is perhaps the point. It seems to have more room inside than outside, which is probably a metaphor for something.",
  'junk mail': "A pile of junk mail. Offers for double glazing, pizza delivery menus, and — buried at the bottom — what appears to be a demolition order from the local council. The demolition order has been there for nine months.",
  beer: "A pint of bitter. It's warm and flat and wonderful. Arguably the finest thing humanity has ever produced, and soon to be its last.",
  sandwich: "A cheese sandwich. It looks adequate. Ford says nothing about the sandwich, which is suspicious.",
  peanuts: "A small bowl of salted peanuts. Ford seems very insistent about the protein. \"You'll need the salt and the protein,\" he says. You decide not to ask why.",
  towel: "A towel. It's seen better days, but haven't we all. Ford insists it's \"the most massively useful thing an interstellar hitchhiker can have.\" The words DON'T PANIC are embroidered on it in large, friendly letters.",
  'no tea': "You don't have any tea. This is a problem that will follow you across the galaxy.",
  device: "A small black device with a large, friendly GREEN BUTTON. Ford calls it a Sub-Etha Sens-O-Matic — an electronic signaling device for hitchhikers.",
};

// ─── HELP TEXT ───────────────────────────────────────────────────────────────

const HELP_TEXT = `
╔══════════════════════════════════════════════════════════════╗
║              INFOCOM PARSER — COMMAND REFERENCE              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   LOOK .............. Examine your surroundings              ║
║   LOOK [item] ....... Examine a specific item                ║
║   TAKE [item] ....... Pick something up                      ║
║   INVENTORY / I ...... Check what you're carrying             ║
║   GO [direction] ..... Move (NORTH/SOUTH/N/S)                ║
║   TALK [person] ...... Speak with someone                    ║
║   TURN ON LIGHT ...... Turn on the light                     ║
║   STAND / GET UP ..... Get out of bed                        ║
║   LIE DOWN ........... Lie down (context-sensitive)          ║
║   WAIT ............... Wait and see what happens             ║
║   DRINK [item] ....... Drink something                       ║
║   EAT [item] ......... Eat something                         ║
║   WEAR [item] ........ Put something on                      ║
║   GIVE [item] TO ..... Give an item to someone               ║
║   PRESS [thing] ...... Press a button                        ║
║   HELP ............... This screen                            ║
║   QUIT / EXIT ........ Return to terminal                    ║
║                                                              ║
║   Directions: NORTH/N  SOUTH/S  EAST/E  WEST/W              ║
║                                                              ║
║   TIP: Try examining everything. Douglas Adams hid           ║
║   jokes in the furniture.                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;

// ─── VOGON SCENE TEXT ────────────────────────────────────────────────────────

const VOGON_POETRY = `And then — the sky changes.

Not in the way skies normally change, with clouds and weather
and the general meteorological shuffling that happens when the
atmosphere gets bored. No. The sky goes dark. Completely,
utterly, catastrophically dark, as if someone has drawn the
curtains on the entire planet.

A shadow falls across the land. Several shadows, in fact.
Enormous, city-sized shadows.

You look up.

Everyone looks up.

The ships hang in the sky in much the same way that bricks
don't.

Vast, yellow, ugly ships. Vogon Constructor Fleet ships.
They blot out the sun with the casual indifference of someone
who doesn't know what a sun is for and doesn't particularly
care.

A voice booms across the planet. It is the kind of voice that
makes you want to hide behind furniture.`;

const VOGON_ANNOUNCEMENT = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   "PEOPLE OF EARTH, YOUR ATTENTION PLEASE."                  ║
║                                                              ║
║   "THIS IS PROSTETNIC VOGON JELTZ OF THE GALACTIC            ║
║   HYPERSPACE PLANNING COUNCIL."                              ║
║                                                              ║
║   "AS YOU WILL NO DOUBT BE AWARE, THE PLANS FOR              ║
║   DEVELOPMENT OF THE OUTLYING REGIONS OF THE GALAXY          ║
║   REQUIRE THE BUILDING OF A HYPERSPATIAL EXPRESS             ║
║   ROUTE THROUGH YOUR STAR SYSTEM, AND REGRETTABLY            ║
║   YOUR PLANET IS ONE OF THOSE SCHEDULED FOR                  ║
║   DEMOLITION."                                               ║
║                                                              ║
║   "THE PROCESS WILL TAKE SLIGHTLY LESS THAN TWO OF           ║
║   YOUR EARTH MINUTES. THANK YOU."                            ║
║                                                              ║
║   "THERE'S NO POINT IN ACTING SURPRISED ABOUT IT.            ║
║   ALL THE PLANNING CHARTS AND DEMOLITION ORDERS HAVE         ║
║   BEEN ON DISPLAY AT YOUR LOCAL PLANNING DEPARTMENT           ║
║   IN ALPHA CENTAURI FOR FIFTY OF YOUR EARTH YEARS,           ║
║   SO YOU'VE HAD PLENTY OF TIME TO LODGE ANY FORMAL           ║
║   COMPLAINT AND IT'S FAR TOO LATE TO START MAKING            ║
║   A FUSS ABOUT IT NOW."                                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;

const DONT_PANIC = `

  ████████████████████████████████████████████████████████████
  ██                                                        ██
  ██     ██████╗  ██████╗ ███╗   ██╗██╗████████╗            ██
  ██     ██╔══██╗██╔═══██╗████╗  ██║╚═╝╚══██╔══╝            ██
  ██     ██║  ██║██║   ██║██╔██╗ ██║      ██║               ██
  ██     ██║  ██║██║   ██║██║╚██╗██║      ██║               ██
  ██     ██████╔╝╚██████╔╝██║ ╚████║      ██║               ██
  ██     ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝      ╚═╝               ██
  ██                                                        ██
  ██     ██████╗  █████╗ ███╗   ██╗██╗ ██████╗              ██
  ██     ██╔══██╗██╔══██╗████╗  ██║██║██╔════╝              ██
  ██     ██████╔╝███████║██╔██╗ ██║██║██║                   ██
  ██     ██╔═══╝ ██╔══██║██║╚██╗██║██║██║                   ██
  ██     ██║     ██║  ██║██║ ╚████║██║╚██████╗              ██
  ██     ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝              ██
  ██                                                        ██
  ████████████████████████████████████████████████████████████

  The Earth has been demolished. You have been demolished.
  Your house — which was about to be demolished anyway —
  has been rendered somewhat redundant.

  On the plus side, you won't need to worry about the bypass.

  SCORE: 42 out of a possible 400.
  (You did about as well as could be expected, all things
  considered.)

  ─────────────────────────────────────────────────────────
  Type RESTART to play again, or QUIT to exit.
`;

// ─── PARSER ──────────────────────────────────────────────────────────────────

const DIRECTION_ALIASES = {
  n: 'north', s: 'south', e: 'east', w: 'west',
  north: 'north', south: 'south', east: 'east', west: 'west',
};

const parseInput = (raw) => {
  const input = raw.trim().toLowerCase();
  if (!input) return { verb: '', noun: '' };

  // Special multi-word verbs
  if (input === 'lie down') return { verb: 'lie', noun: 'down' };
  if (input === 'get up' || input === 'get out of bed' || input === 'stand up' || input === 'stand') return { verb: 'stand', noun: '' };
  if (input === 'turn on light' || input === 'switch on light' || input === 'turn light on') return { verb: 'light', noun: '' };
  if (input === 'open curtains' || input === 'draw curtains') return { verb: 'light', noun: '' };
  if (input === 'pick up') return { verb: 'take', noun: '' };
  if (input.startsWith('pick up ')) return { verb: 'take', noun: input.slice(8) };
  if (input.startsWith('look at ')) return { verb: 'look', noun: input.slice(8) };
  if (input.startsWith('look in ')) return { verb: 'look', noun: input.slice(8) };
  if (input.startsWith('talk to ')) return { verb: 'talk', noun: input.slice(8) };
  if (input.startsWith('speak to ')) return { verb: 'talk', noun: input.slice(9) };
  if (input.startsWith('go to ')) return { verb: 'go', noun: input.slice(6) };
  if (input.startsWith('give ') && input.includes(' to ')) {
    const match = input.match(/^give\s+(.+?)\s+to\s+(.+)$/);
    if (match) return { verb: 'give', noun: match[1], target: match[2] };
  }
  if (input.startsWith('press ') || input.startsWith('push ')) return { verb: 'press', noun: input.split(/\s+/).slice(1).join(' ') };
  if (input.startsWith('feed ')) {
    const match = input.match(/^feed\s+(.+?)\s+to\s+(.+)$/);
    if (match) return { verb: 'give', noun: match[1], target: match[2] };
    return { verb: 'give', noun: input.slice(5) };
  }

  const words = input.split(/\s+/);
  let verb = words[0];
  let noun = words.slice(1).join(' ');

  // Verb aliases
  const verbMap = {
    get: 'take', grab: 'take', pickup: 'take',
    walk: 'go', move: 'go', head: 'go',
    speak: 'talk', say: 'talk', ask: 'talk',
    examine: 'look', x: 'look', inspect: 'look', read: 'look', check: 'look',
    wear: 'wear',
    buy: 'take',
    i: 'inventory', inv: 'inventory',
    exit: 'quit', q: 'quit',
    l: 'look',
    z: 'wait',
  };

  if (verbMap[verb]) verb = verbMap[verb];

  // Direction as bare command
  if (DIRECTION_ALIASES[verb] && !noun) {
    noun = DIRECTION_ALIASES[verb];
    verb = 'go';
  }

  return { verb, noun };
};

// ─── GAME COMPONENT ──────────────────────────────────────────────────────────

const HitchhikerGame = () => {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('bedroom');
  const [inventory, setInventory] = useState([]);
  const [flags, setFlags] = useState({
    visitedRooms: {},
    lightOn: false,
    inBed: true,
    headache: true,
    gownWorn: false,
    lookedPocket: false,
    liedDown: false,
    fordArrived: false,
    prosserTalked: false,
    prosserLying: false,
    beerDrunk: 0,
    towelTaken: false,
    sandwichTaken: false,
    fordTalked: 0,
    dogAppeared: false,
    dogFed: false,
    deviceDropped: false,
    gameOver: false,
  });
  const [vogonPhase, setVogonPhase] = useState(0);
  const [titleScreen, setTitleScreen] = useState(true);
  const [guideImg, setGuideImg] = useState(0);
  const [guideOff, setGuideOff] = useState(true);
  const [guideEnlarged, setGuideEnlarged] = useState(false);
  const outputRef = useRef(null);

  // Refs for state in event handlers
  const currentRoomRef = useRef(currentRoom);
  const inventoryRef = useRef(inventory);
  const flagsRef = useRef(flags);
  const vogonPhaseRef = useRef(vogonPhase);
  const inputTextRef = useRef(inputText);

  useEffect(() => { currentRoomRef.current = currentRoom; }, [currentRoom]);
  useEffect(() => { inventoryRef.current = inventory; }, [inventory]);
  useEffect(() => { flagsRef.current = flags; }, [flags]);
  useEffect(() => { vogonPhaseRef.current = vogonPhase; }, [vogonPhase]);
  useEffect(() => { inputTextRef.current = inputText; }, [inputText]);

  // ── Enter/exit game mode ─────────────────────────────────────────────────
  useEffect(() => {
    enterGameMode();
    return () => exitGameMode();
  }, []);

  // ── Focus container ──────────────────────────────────────────────────────
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  // ── Auto-scroll to bottom on new output ─────────────────────────────────
  useEffect(() => {
    if (!outputRef.current || titleScreen) return;
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [outputLines, titleScreen]);

  // ── Start the game when title screen is dismissed ─────────────────────
  useEffect(() => {
    if (titleScreen) return;
    const lines = [
      { text: `— ${ROOMS.bedroom.name} —`, type: 'room' },
      { text: '', type: 'normal' },
      { text: ROOMS.bedroom.onEnter, type: 'normal' },
    ];
    setOutputLines(lines);
    setFlags(f => ({ ...f, visitedRooms: { ...f.visitedRooms, bedroom: true } }));
  }, [titleScreen]);

  // ── Append output helper ─────────────────────────────────────────────────
  const addOutput = useCallback((text, type = 'normal') => {
    setOutputLines(prev => [...prev, { text, type }]);
  }, []);

  const addOutputMulti = useCallback((items) => {
    setOutputLines(prev => [...prev, ...items]);
  }, []);

  // ── Has item helper ──────────────────────────────────────────────────────
  const hasItem = (item) => inventoryRef.current.includes(item);

  // ── Room description helper ─────────────────────────────────────────────
  const getRoomDesc = useCallback((roomId, fl) => {
    const room = ROOMS[roomId];
    if (roomId === 'bedroom') {
      return fl.lightOn ? room.descLight(fl) : room.descDark;
    }
    const desc = room.description;
    return typeof desc === 'function' ? desc(fl) : desc;
  }, []);

  // ── PROCESS COMMAND ──────────────────────────────────────────────────────
  const processCommand = useCallback((raw) => {
    const room = currentRoomRef.current;
    const fl = flagsRef.current;
    const parsed = parseInput(raw);
    const { verb, noun } = parsed;
    const output = [];

    const say = (text, type = 'normal') => output.push({ text, type });
    const roomSay = (text) => output.push({ text, type: 'room' });
    const commit = () => addOutputMulti([{ text: `> ${raw}`, type: 'input' }, ...output]);

    // ── RESTART ──────────────────────────────────────────────────────────
    if (verb === 'restart') {
      setCurrentRoom('bedroom');
      setInventory([]);
      setFlags({
        visitedRooms: {},
        lightOn: false,
        inBed: true,
        headache: true,
        gownWorn: false,
        lookedPocket: false,
        liedDown: false,
        fordArrived: false,
        prosserTalked: false,
        prosserLying: false,
        beerDrunk: 0,
        towelTaken: false,
        sandwichTaken: false,
        fordTalked: 0,
        dogAppeared: false,
        dogFed: false,
        deviceDropped: false,
        gameOver: false,
      });
      setVogonPhase(0);
      setOutputLines([
        { text: `— ${ROOMS.bedroom.name} —`, type: 'room' },
        { text: '', type: 'normal' },
        { text: ROOMS.bedroom.onEnter, type: 'normal' },
      ]);
      return;
    }

    // ── QUIT ─────────────────────────────────────────────────────────────
    if (verb === 'quit') {
      say("\nSo long, and thanks for all the fish.\n");
      commit();
      setTimeout(() => exitGameMode(), 1200);
      return;
    }

    // ── GAME OVER STATE ──────────────────────────────────────────────────
    if (fl.gameOver) {
      say("\nThe Earth has been demolished. There's not much to do.");
      say("Type RESTART or QUIT.");
      commit();
      return;
    }

    // ── HELP ─────────────────────────────────────────────────────────────
    if (verb === 'help') { say(HELP_TEXT); commit(); return; }

    // ── INVENTORY ────────────────────────────────────────────────────────
    if (verb === 'inventory') {
      say('');
      if (inventoryRef.current.length === 0) {
        say("You are carrying nothing. This is philosophically interesting but practically useless.");
      } else {
        say("You are carrying:");
        inventoryRef.current.forEach(item => say(`  - ${item.toUpperCase()}`));
        if (fl.gownWorn) say("  (wearing the DRESSING GOWN)");
      }
      commit(); return;
    }

    // ── VOGON SCENE (special room) ───────────────────────────────────────
    if (room === 'vogon') {
      if (verb === 'look') {
        say("\nThe sky is full of Vogon ships. The Earth is being demolished. There's really nothing more to look at.");
      } else {
        say("\nThe Earth has been demolished. There's not much to do.");
        say("Type RESTART or QUIT.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── TURN ON LIGHT ────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'light') {
      if (room !== 'bedroom') {
        say("\nThere's no light switch here that you can see.");
      } else if (fl.lightOn) {
        say("\nThe light is already on.");
      } else {
        say("\nGood start. You fumble for the light switch. After a brief but intense battle with the darkness, you find it.");
        say("\nLight floods the room. Your eyes protest violently. The room is revealed in all its squalid glory.");
        say('');
        setFlags(f => ({ ...f, lightOn: true }));
        say(ROOMS.bedroom.descLight({ ...fl, lightOn: true }));
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── STAND / GET UP ───────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'stand') {
      if (room === 'bedroom') {
        if (!fl.inBed) {
          say("\nYou're already standing. Well, swaying. Same thing.");
        } else if (!fl.lightOn) {
          say("\nYou try to get out of bed in the dark. You stumble into something. It's the wall. The wall has always been there. You should have remembered that.\n\n(Perhaps try TURN ON LIGHT first.)");
        } else {
          say("\nYou swing your legs out of bed and stand up. The room lurches sideways briefly, then grudgingly agrees to stay put." + (fl.headache ? " Your headache throbs in protest." : ""));
          setFlags(f => ({ ...f, inBed: false }));
        }
      } else if (room === 'frontyard' && fl.liedDown) {
        if (!fl.prosserLying) {
          say("\nYou can't get up now! The bulldozer will flatten your house the moment you move!");
        } else {
          say("\nYou stand up. Mr. Prosser obediently takes your place in the mud, looking confused but compliant.");
        }
      } else {
        say("\nYou're already standing.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── LOOK ─────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'look') {
      if (!noun) {
        say('');
        roomSay(`— ${ROOMS[room].name} —`);
        say('');
        say(getRoomDesc(room, fl));
      } else if (room === 'bedroom' && !fl.lightOn) {
        say("\nIt's dark. You can't see a thing. Not a sausage. The darkness is absolute and uncompromising.");
      } else if (noun === 'pocket' || noun === 'pockets') {
        if (!fl.gownWorn) {
          say("\nYou're not wearing anything with pockets. Or much of anything, really.");
        } else if (!fl.lookedPocket) {
          say("\nYou rummage through the gown pocket. You find:");
          say("\n  - A bottle of BUFFERED ANALGESIC");
          say("  - Some POCKET FLUFF");
          say("  - A THING YOUR AUNT GAVE YOU which you have never been entirely sure what it is.");
          say("\nYou also notice a distinct absence of TEA, which seems like an oversight on the part of the universe.");
          setInventory(prev => [...prev, 'analgesic', 'fluff', 'thing your aunt gave you', 'no tea']);
          setFlags(f => ({ ...f, lookedPocket: true }));
        } else {
          say("\nYou've already searched your pockets. They haven't gotten any more interesting.");
        }
      } else if (noun === 'analgesic' || noun === 'aspirin' || noun === 'asprin' || noun === 'buffered analgesic') {
        say('\n' + ITEM_DESCRIPTIONS.analgesic);
      } else if (noun === 'gown' || noun === 'dressing gown' || noun === 'robe') {
        say('\n' + ITEM_DESCRIPTIONS.gown);
      } else if (noun === 'phone') {
        say('\n' + ITEM_DESCRIPTIONS.phone);
      } else if (noun === 'screwdriver' && room === 'bedroom') {
        say('\n' + ITEM_DESCRIPTIONS.screwdriver);
      } else if (noun === 'toothbrush' && room === 'bedroom') {
        say('\n' + ITEM_DESCRIPTIONS.toothbrush);
      } else if (noun === 'bed' && room === 'bedroom') {
        say("\nYour bed. It looks like a fight occurred in it. Both sides lost.");
      } else if (noun === 'shelf' && room === 'bedroom') {
        say("\nA shelf cluttered with the archaeology of bedside living: a screwdriver, a toothbrush, a half-read book about the mating habits of newts (you were going through a phase), and a glass of water that has achieved room temperature and is considering evaporation.");
      } else if (noun === 'bulldozer' && room === 'frontyard') {
        say("\nIt's a large, yellow, purposeful-looking bulldozer. It will demolish your house with the same emotional engagement with which you might crush a biscuit.");
      } else if ((noun === 'prosser' || noun === 'mr prosser') && room === 'frontyard') {
        say("\nMr. L. Prosser. Age 40. A nervous, fidgety man. He has an oddly-shaped head — rather small, and flat on top. He is, on his mother's side, directly descended from Genghis Khan, though he doesn't know this and if he did it wouldn't help him in any appreciable way.");
      } else if (noun === 'ford' && room === 'pub') {
        say("\nFord Prefect. He's not from Guildford after all. He's not even from Earth. He looks like he's trying to do several impossible things at once, and succeeding at most of them.");
      } else if (noun === 'beer' && room === 'pub') {
        say('\n' + ITEM_DESCRIPTIONS.beer);
      } else if ((noun === 'sandwich' || noun === 'cheese sandwich') && room === 'pub') {
        say('\n' + ITEM_DESCRIPTIONS.sandwich);
      } else if (noun === 'peanuts' && room === 'pub') {
        say('\n' + ITEM_DESCRIPTIONS.peanuts);
      } else if (noun === 'towel' && (room === 'pub' || hasItem('towel'))) {
        say('\n' + ITEM_DESCRIPTIONS.towel);
      } else if ((noun === 'junk mail' || noun === 'mail') && (room === 'porch' || hasItem('junk mail'))) {
        say('\n' + ITEM_DESCRIPTIONS['junk mail']);
      } else if (noun === 'fluff' && hasItem('fluff')) {
        say('\n' + ITEM_DESCRIPTIONS.fluff);
      } else if ((noun === 'thing' || noun === 'thing your aunt gave you') && hasItem('thing your aunt gave you')) {
        say('\n' + ITEM_DESCRIPTIONS['thing your aunt gave you']);
      } else if (noun === 'no tea' || noun === 'tea') {
        say('\n' + ITEM_DESCRIPTIONS['no tea']);
      } else if (noun === 'curtains' || noun === 'window') {
        say("\nThe curtains are drawn. Behind them, the world is happening without your consent. This is typical of the world.");
      } else if (noun === 'house' && room === 'frontyard') {
        say("\nYour house. It's small and somewhat ratty, but it's yours. Or it was. Bureaucracy has other plans for it.");
      } else if ((noun === 'dog') && room === 'lane' && fl.dogAppeared) {
        say("\nA small, mangy mongrel of no particular breed. It's looking at you with the kind of desperate optimism that only dogs and salesmen can manage." + (fl.dogFed ? " It appears to have eaten recently and is very pleased about it." : ""));
      } else if ((noun === 'device' || noun === 'thumb' || noun === 'sub-etha') && room === 'lane' && fl.deviceDropped) {
        say('\n' + ITEM_DESCRIPTIONS.device);
      } else {
        say("\nYou don't see that here.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── TAKE / GET ───────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'take') {
      if (!noun) {
        say("\nTake what? You reach out and grasp the air. It is unimpressed.");
      } else if (room === 'bedroom' && !fl.lightOn) {
        say("\nIt's dark. You grope around blindly and find nothing useful. This is not unlike most of your attempts at finding things even with the light on.");
      } else if (room === 'bedroom' && fl.inBed && noun !== 'gown' && noun !== 'dressing gown' && noun !== 'robe') {
        say("\nYou can't reach that from bed. Try STAND or GET UP first.");
      // ── Bedroom items ──
      } else if ((noun === 'gown' || noun === 'dressing gown' || noun === 'robe') && room === 'bedroom') {
        if (fl.gownWorn) {
          say("\nYou're already wearing it.");
        } else {
          say("\nYou pick up the dressing gown. It provides the exact amount of dignity one would expect from a dressing gown, which is to say: almost none, but just enough to answer the door. You notice something in the pocket.\n\nTaken.");
          setInventory(prev => [...prev, 'gown']);
          setFlags(f => ({ ...f, gownWorn: true }));
        }
      } else if ((noun === 'analgesic' || noun === 'aspirin' || noun === 'asprin' || noun === 'buffered analgesic') && room === 'bedroom') {
        if (hasItem('analgesic') || !fl.headache) {
          say("\nYou've already got the analgesic.");
        } else if (!fl.lookedPocket) {
          say("\nYou don't see any analgesic here. (Have you checked your POCKETS?)");
        } else {
          say("\nYou already found it in your pocket.");
        }
      } else if (noun === 'screwdriver' && room === 'bedroom') {
        if (hasItem('screwdriver')) {
          say("\nYou already have the screwdriver.");
        } else if (fl.headache) {
          say("\nYou reach for the screwdriver. Luckily, this is too small for you to get hold of while your head is throbbing this badly. Try taking something for that headache first.");
        } else {
          say("\nYou take the screwdriver. It's flat-headed. This will be important later, though you don't know why yet.\n\nTaken.");
          setInventory(prev => [...prev, 'screwdriver']);
        }
      } else if (noun === 'toothbrush' && room === 'bedroom') {
        if (hasItem('toothbrush')) {
          say("\nYou already have the toothbrush.");
        } else if (fl.headache) {
          say("\nYou reach for the toothbrush but your hand is shaking too badly. Take something for that headache first.");
        } else {
          say("\nYou take the toothbrush. Good dental hygiene, even in the face of the apocalypse.\n\nTaken.");
          setInventory(prev => [...prev, 'toothbrush']);
        }
      } else if (noun === 'phone' && room === 'bedroom') {
        say("\nYou pick up the phone. The notification stares at you accusingly. You put it back down. Some things are better left unread.");
      // ── Porch items ──
      } else if ((noun === 'mail' || noun === 'junk mail') && room === 'porch') {
        if (hasItem('junk mail')) {
          say("\nYou've already got the mail.");
        } else {
          say("\nYou pick up the junk mail. Most of it is rubbish — double glazing offers, pizza menus. But at the bottom there's a demolition notice from the council. The date is nine months ago.\n\nTaken.");
          setInventory(prev => [...prev, 'junk mail']);
        }
      // ── Frontyard items ──
      } else if (noun === 'bulldozer' && room === 'frontyard') {
        say("\nIt weighs several tons. Your arms do not. The maths is against you on this one.");
      } else if ((noun === 'prosser' || noun === 'mr prosser') && room === 'frontyard') {
        say("\nMr. Prosser is not the kind of thing one takes. He is the kind of thing that happens to you, like weather or tax audits.");
      // ── Pub items ──
      } else if (noun === 'beer' && room === 'pub') {
        say("\nFord pushes the beer toward you. \"Drink it, don't carry it. There isn't time.\"\n\n(Try DRINK BEER instead.)");
      } else if ((noun === 'sandwich' || noun === 'cheese sandwich') && room === 'pub') {
        if (fl.sandwichTaken) {
          say("\nYou already have the sandwich.");
        } else {
          say("\nYou take the cheese sandwich from the counter. It's not much to look at, but it cost a pound.\n\nTaken.");
          setInventory(prev => [...prev, 'sandwich']);
          setFlags(f => ({ ...f, sandwichTaken: true }));
        }
      } else if (noun === 'peanuts' && room === 'pub') {
        say("\n\"Leave the peanuts,\" says Ford. \"I'll get you some later. Just drink your beer.\"");
      } else if (noun === 'towel' && room === 'pub') {
        if (fl.towelTaken) {
          say("\nYou already have the towel. Relax. Don't Panic.");
        } else {
          say("\nFord pushes the towel toward you with the reverence usually reserved for religious artifacts.\n\n\"A towel,\" Ford says solemnly, \"is about the most massively useful thing an interstellar hitchhiker can have.\"\n\nThe words DON'T PANIC are written on it in large, friendly letters.\n\nTaken.");
          setInventory(prev => [...prev, 'towel']);
          setFlags(f => ({ ...f, towelTaken: true }));
        }
      // ── Lane items ──
      } else if ((noun === 'device' || noun === 'thumb' || noun === 'sub-etha') && room === 'lane' && fl.deviceDropped) {
        if (hasItem('device')) {
          say("\nYou already have the device.");
        } else {
          say("\nYou pick up the small black device. It has a large, friendly green button on it.\n\nTaken.");
          setInventory(prev => [...prev, 'device']);
        }
      } else {
        say("\nYou can't take that. " + (Math.random() > 0.5
          ? "It doesn't want to be taken, and frankly, who can blame it?"
          : "Some things in life are simply not portable."));
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── WEAR ─────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'wear') {
      if (noun === 'gown' || noun === 'dressing gown' || noun === 'robe') {
        if (fl.gownWorn) {
          say("\nYou're already wearing it. Looking good. Well, looking acceptable.");
        } else if (room === 'bedroom' && !fl.lightOn) {
          say("\nYou fumble around in the dark and find the dressing gown. You put it on. You notice something in the pocket.\n\nWorn.");
          if (!hasItem('gown')) setInventory(prev => [...prev, 'gown']);
          setFlags(f => ({ ...f, gownWorn: true }));
        } else if (hasItem('gown') || room === 'bedroom') {
          say("\nYou put on the dressing gown. You are now marginally more dressed than you were before.\n\nWorn.");
          if (!hasItem('gown')) setInventory(prev => [...prev, 'gown']);
          setFlags(f => ({ ...f, gownWorn: true }));
        } else {
          say("\nYou don't see a gown here.");
        }
      } else if (noun === 'towel') {
        say("\nYou drape the towel around your shoulders. You look like a very confused superhero.");
      } else {
        say("\nYou can't wear that. Not without causing a scene, anyway.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── EAT ──────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'eat') {
      if (noun === 'analgesic' || noun === 'aspirin' || noun === 'asprin' || noun === 'buffered analgesic') {
        if (!hasItem('analgesic')) {
          say("\nYou don't have any analgesic. " + (!fl.lookedPocket && fl.gownWorn ? "(Have you checked your POCKETS?)" : ""));
        } else if (!fl.headache) {
          say("\nYour headache is already gone. Taking more would be greedy.");
        } else {
          say("\nYou swallow the analgesic. It tastes like chalk and broken promises, but your headache recedes like a tide going out — revealing all the unpleasant things lurking underneath, but at least you can see them now.");
          say("\n+10 POINTS. (You are now slightly less likely to die.)");
          setFlags(f => ({ ...f, headache: false }));
          setInventory(prev => prev.filter(i => i !== 'analgesic'));
        }
      } else if (noun === 'peanuts' && hasItem('peanuts')) {
        say("\nYou eat some peanuts. They're salty and protein-rich, which Ford assures you is important for surviving matter transference beams.");
      } else if (noun === 'sandwich' || noun === 'cheese sandwich') {
        if (hasItem('sandwich')) {
          say("\nYou eat the cheese sandwich. It's adequate.\n\nFord gives you a look. \"I hope that wasn't important,\" he says.\n\n(HINT: It was. You just made the game significantly harder later. But we won't worry about that now.)");
          setInventory(prev => prev.filter(i => i !== 'sandwich'));
        } else {
          say("\nYou don't have a sandwich.");
        }
      } else {
        say("\nYou can't eat that. Your digestive system has standards, even if you don't.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── DRINK ────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'drink') {
      if (room === 'pub' && (noun === 'beer' || noun === 'pint' || noun === 'bitter')) {
        const beerCount = fl.beerDrunk;
        if (beerCount === 0) {
          say("\nYou drink the first pint. It's warm and flat and utterly perfect. Ford says something about Betelgeuse. You assume it's a pub.\n\nFord pushes another pint toward you.");
        } else if (beerCount === 1) {
          say("\nYou drink the second pint. Ford says something about \"muscle relaxant\" which you choose not to examine too closely.\n\n\"Three pints,\" Ford says. \"Three pints is almost enough.\"");
        } else if (beerCount === 2) {
          say("\nYou drink the third pint. Your muscles are now thoroughly relaxed. So is your grasp on reality.\n\nA distant crash echoes from the direction of your house.\n\n\"Good,\" says Ford. \"Now — have you got the towel? We should go.\"");
        } else {
          say("\nYou've had enough beer. Ford is pulling your arm urgently. \"We really need to leave NOW,\" he says.\n\n(Try GO EAST to head outside.)");
        }
        setFlags(f => ({ ...f, beerDrunk: f.beerDrunk + 1 }));
      } else if (noun === 'tea') {
        say("\nYou don't have any tea. The absence of tea is a running theme in your life. It will continue to be a running theme across several galaxies.");
      } else {
        say("\nYou can't drink that.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── GO / MOVE ────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'go') {
      const dir = DIRECTION_ALIASES[noun] || noun;
      if (!dir) {
        say("\nGo where? The universe is large, but you need to be more specific.");
        commit(); return;
      }

      // ── Bedroom exits ──
      if (room === 'bedroom' && dir === 'south') {
        if (!fl.lightOn) {
          say("\nYou stumble in the dark and walk into a wall. The wall jostles you rather rudely.\n\n(Try TURN ON LIGHT.)");
        } else if (fl.inBed) {
          say("\nYou can't go anywhere while lying in bed. Try STAND or GET UP.");
        } else if (fl.headache) {
          say("\nYou try to walk to the door but miss the doorway by a good eighteen inches. The wall jostles you rather rudely. Your headache makes precise navigation impossible.\n\n(Perhaps you should take something for that headache. Have you checked your POCKETS?)");
        } else if (!fl.gownWorn) {
          say("\nYou can't go outside in your underwear. Well, you could, but you'd be arrested. Find something to wear first.");
        } else {
          say('');
          roomSay(`— ${ROOMS.porch.name} —`);
          say('');
          if (!fl.visitedRooms.porch) {
            say(ROOMS.porch.onEnter);
            say('');
          }
          say(ROOMS.porch.description);
          setCurrentRoom('porch');
          setFlags(f => ({ ...f, visitedRooms: { ...f.visitedRooms, porch: true } }));
        }
      // ── Porch exits ──
      } else if (room === 'porch' && dir === 'north') {
        say('');
        roomSay(`— ${ROOMS.bedroom.name} —`);
        say('');
        say(getRoomDesc('bedroom', fl));
        setCurrentRoom('bedroom');
      } else if (room === 'porch' && dir === 'south') {
        say('');
        roomSay(`— ${ROOMS.frontyard.name} —`);
        say('');
        if (!fl.visitedRooms.frontyard) {
          say(ROOMS.frontyard.onEnter);
          say('');
        }
        say(getRoomDesc('frontyard', fl));
        setCurrentRoom('frontyard');
        setFlags(f => ({ ...f, visitedRooms: { ...f.visitedRooms, frontyard: true } }));
      // ── Frontyard exits ──
      } else if (room === 'frontyard' && dir === 'north') {
        say('');
        roomSay(`— ${ROOMS.porch.name} —`);
        say('');
        say(ROOMS.porch.description);
        setCurrentRoom('porch');
      } else if (room === 'frontyard' && dir === 'south') {
        if (!fl.prosserLying) {
          say("\nYou can't leave! The bulldozer will flatten your house the moment you turn your back. You need to do something about this situation first.\n\n" + (!fl.liedDown ? "(Perhaps try LYING DOWN in front of the bulldozer.)" : "(Wait for events to unfold...)"));
        } else {
          say('');
          roomSay(`— ${ROOMS.pub.name} —`);
          say('');
          say(ROOMS.pub.onEnter);
          say('');
          say(getRoomDesc('pub', fl));
          setCurrentRoom('pub');
          setFlags(f => ({ ...f, visitedRooms: { ...f.visitedRooms, pub: true } }));
        }
      // ── Pub exits ──
      } else if (room === 'pub' && dir === 'east') {
        if (fl.beerDrunk < 3) {
          say("\nFord grabs your arm. \"You haven't had enough beer yet. Trust me, you'll need it.\"\n\n(DRINK BEER " + (3 - fl.beerDrunk) + " more time" + (3 - fl.beerDrunk > 1 ? "s" : "") + ".)");
        } else if (!fl.towelTaken) {
          say("\nFord stops you. \"The towel! Don't forget the towel! It's the most important thing!\"\n\n(TAKE TOWEL before leaving.)");
        } else {
          say('');
          roomSay(`— ${ROOMS.lane.name} —`);
          say('');
          say(ROOMS.lane.onEnter);
          say('');
          setFlags(f => ({ ...f, visitedRooms: { ...f.visitedRooms, lane: true }, dogAppeared: true }));
          say(ROOMS.lane.description({ ...fl, dogAppeared: true }));
          setCurrentRoom('lane');
        }
      } else if (room === 'pub' && dir === 'west') {
        say("\nThere's nothing that way but more pub wall.");
      // ── Lane exits ──
      } else if (room === 'lane' && dir === 'west') {
        say('');
        roomSay(`— ${ROOMS.pub.name} —`);
        say('');
        say(getRoomDesc('pub', fl));
        setCurrentRoom('pub');
      } else if (room === 'lane' && dir === 'east') {
        if (!fl.deviceDropped) {
          say("\nYou look east. Your house — or what's left of it — is a pile of rubble. There's nothing useful in that direction.\n\nFord is scanning the sky anxiously.");
        } else {
          say("\nThere's nothing east but the ruins of your house. Ford is right here — use the device!");
        }
      } else {
        const msgs = [
          "You can't go that way.",
          "There's no exit in that direction.",
          "You walk into a wall. The wall wins.",
        ];
        say('\n' + msgs[Math.floor(Math.random() * msgs.length)]);
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── LIE DOWN ─────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'lie') {
      if (room === 'frontyard') {
        if (fl.liedDown) {
          say("\nYou're already lying down. Horizontal suits you.");
        } else {
          say("\nYou lie down in front of the bulldozer in a dramatic act of protest.");
          say("\nThe mud is cold and damp. Mr. Prosser looks like a man who has just realized his day is about to get significantly more complicated.");
          say("\n\"Come off it, Mr. Dent,\" he says, \"you can't win, you know. You can't lie in front of the bulldozer indefinitely.\"");
          say("\n\"I'm game,\" you say. \"We'll see who rusts first.\"");
          setFlags(f => ({ ...f, liedDown: true }));

          // Ford arrives after lying down
          setTimeout(() => {
            if (currentRoomRef.current === 'frontyard') {
              const fordLines = [
                { text: '', type: 'normal' },
                { text: "A shadow falls across you. You look up.", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "\"Hello, Arthur,\" says Ford Prefect.", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "Ford Prefect. Your friend. Not actually from Guildford, as it turns out, but from a small planet somewhere in the vicinity of Betelgeuse. You don't know this yet.", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "\"Ford! I'm having a terrible day.\"", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "\"Yes, I know,\" says Ford. \"Listen, I need you to come to the pub with me immediately. It's vitally important.\"", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "\"But my house — the bulldozer —\"", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "Ford turns to Mr. Prosser. \"Mr. Prosser, if Mr. Dent leaves, will you promise to lie in front of the bulldozer for him?\"", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "Mr. Prosser, who has never had an original thought in his life, agrees before his brain can file an objection. He lies down obediently in the mud.", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "\"Come on,\" says Ford. He seems unusually urgent.", type: 'normal' },
                { text: '', type: 'normal' },
                { text: "(You can now GO SOUTH to follow Ford to the pub.)", type: 'hint' },
              ];
              setOutputLines(prev => [...prev, ...fordLines]);
              setFlags(f => ({ ...f, fordArrived: true, prosserLying: true }));
            }
          }, 3000);
        }
      } else if (room === 'bedroom') {
        if (fl.inBed) {
          say("\nYou're already in bed. This is, arguably, the most sensible place to be today.");
        } else {
          say("\nYou lie down on your bed. You've only just gotten up. The bed is warm and inviting. But something nags at you. Something about today feels... terminal.");
          setFlags(f => ({ ...f, inBed: true }));
        }
      } else if (room === 'pub') {
        say("\nYou lie down on the pub floor. The barman gives you a look that suggests this is not the first time someone has done this, but that it never gets less disappointing.");
      } else {
        say("\nYou lie down. The ground is there for you, as always.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── WAIT ─────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'wait') {
      if (room === 'frontyard' && !fl.liedDown) {
        say("\nYou wait. The bulldozer waits. Mr. Prosser waits. This is very English of all of you, but it isn't going to save your house.\n\n(Perhaps you should try LYING DOWN in front of the bulldozer.)");
      } else if (room === 'frontyard' && fl.liedDown && !fl.fordArrived) {
        say("\nYou wait in the mud. It's wet. It's cold. It's mud.");
      } else if (room === 'pub') {
        say("\nYou wait. Ford taps the table impatiently. \"We really don't have time for this,\" he says. \"The world is going to end in about twelve minutes.\"");
      } else if (room === 'lane' && !fl.deviceDropped) {
        // Trigger device drop on wait
        say("\nFord is looking at the sky. He fumbles in his satchel and pulls out a small black device.");
        say("\n\"Here,\" he says, pressing it into your hands. \"Electronic Sub-Etha Sens-O-Matic. Standard hitchhiker's equipment. When you see the ships, PRESS THE GREEN BUTTON.\"");
        say("\nFord drops the device on the ground as the sky begins to darken ominously.");
        setFlags(f => ({ ...f, deviceDropped: true }));
      } else {
        say("\nTime passes. Nothing happens. This is what time does best.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── TALK ─────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'talk') {
      if (room === 'frontyard' && (noun === 'prosser' || noun === 'mr prosser' || noun === 'man')) {
        if (!fl.prosserTalked) {
          say("\n\"Mr. Prosser,\" you say, \"why do you want to demolish my house?\"");
          say("\n\"It's a bypass,\" he says. \"You've got to build bypasses.\"");
          say("\nHe says this as if it explains everything. It explains nothing.");
          say("\n\"But why MY house?\"");
          say("\n\"Mr. Dent, the plans have been available at the local planning office for the last nine months.\"");
          say("\n\"Yes. In the bottom of a locked filing cabinet stuck in a disused lavatory with a sign on the door saying 'Beware of the Leopard.'\"");
          say("\nMr. Prosser has the decency to look embarrassed, but not enough decency to stop the bulldozer.");
          setFlags(f => ({ ...f, prosserTalked: true }));
        } else {
          say("\nMr. Prosser has nothing new to say. Bureaucrats rarely do.");
        }
      } else if (room === 'pub' && noun === 'ford') {
        const fordDialogue = [
          ["\n\"Ford, what is going on?\"", "\n\"The world is going to end,\" says Ford.", "\n\"When exactly?\"", "\n\"In about twelve minutes. A Vogon Constructor Fleet is on its way. They're going to demolish the Earth.\"", "\n\"What's a Vogon?\"", "\n\"Trust me, you don't want to know. Drink your beer. Take the towel.\""],
          ["\n\"Ford, are you sure about this?\"", "\n\"Quite sure. I'm a researcher for the Hitchhiker's Guide to the Galaxy. It's a sort of electronic book.\"", "\n\"And what does it say about Earth?\"", "\nFord pauses. \"Mostly harmless.\"", "\n\"MOSTLY HARMLESS?! Is that all?\"", "\n\"It used to just say 'Harmless.' I got the entry updated.\""],
          ["\n\"Ford, what do we do?\"", "\n\"We stick out our thumbs.\"", "\n\"Electronic thumb. Standard hitchhiker's equipment. When the Vogon fleet arrives, I can signal a ship to pick us up. Probably.\"", "\n\"How much of a chance?\"", "\n\"Let's not dwell on numbers. Have another beer. Take the towel. Buy a sandwich.\""],
        ];
        const idx = Math.min(fl.fordTalked, fordDialogue.length - 1);
        fordDialogue[idx].forEach(line => say(line));
        setFlags(f => ({ ...f, fordTalked: f.fordTalked + 1 }));
      } else if (noun === 'barman' && room === 'pub') {
        say("\n\"Last orders,\" says the barman, \"though I suppose that's a bit literal today.\"");
      } else if (noun === 'ford' && room === 'frontyard' && fl.fordArrived) {
        say("\n\"Not now, Arthur. Pub. Now. The world's about to end.\"\n\n(GO SOUTH to head to the pub.)");
      } else if (noun === 'dog' && room === 'lane' && fl.dogAppeared) {
        say("\nThe dog yaps at you. It doesn't have much to say, but it says it with great enthusiasm.");
      } else if (!noun) {
        say("\nTalk to whom?");
      } else {
        say("\nThere's nobody by that name here.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── GIVE ─────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'give') {
      const target = parsed.target || '';
      if ((noun === 'sandwich' || noun === 'cheese sandwich') && room === 'lane' && fl.dogAppeared && (target === 'dog' || !target)) {
        if (!hasItem('sandwich')) {
          say("\nYou don't have a sandwich to give." + (fl.sandwichTaken ? " Oh. You ate it, didn't you?" : ""));
        } else {
          say("\nYou offer the cheese sandwich to the dog. The dog is deeply moved. It wolfs down the sandwich with the kind of gratitude that suggests it has never eaten anything this good, which, given the quality of the sandwich, says a lot about the dog's life.");
          say("\nThe dog wags its tail and curls up contentedly.");
          say("\n+5 POINTS. (The dog will remember this. So will the universe.)");
          setInventory(prev => prev.filter(i => i !== 'sandwich'));
          setFlags(f => ({ ...f, dogFed: true }));
        }
      } else {
        say("\nYou can't give that to anyone here.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── PRESS ────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'press') {
      if ((noun === 'green button' || noun === 'button') && hasItem('device')) {
        say('');
        say('════════════════════════════════════════════════════════════════');
        say('');
        say("You press the green button.");
        say("\nNothing happens for a moment. Then everything happens at once.");
        say('');
        say(VOGON_POETRY);
        say('');
        say(VOGON_ANNOUNCEMENT);
        say('');
        say("Ford grabs your arm. \"NOW!\" he screams.");
        say("\nA strange tingling sensation runs through your body. The last thing you see is the Earth, hanging in space, looking — for the first time in your life — beautiful.");
        say("\nThen it explodes.");
        say('');
        say(DONT_PANIC);
        setCurrentRoom('vogon');
        setFlags(f => ({ ...f, gameOver: true }));
      } else if ((noun === 'green button' || noun === 'button') && room === 'lane' && fl.deviceDropped && !hasItem('device')) {
        say("\nYou need to TAKE the DEVICE first.");
      } else {
        say("\nThere's nothing to press here.");
      }
      commit(); return;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── USE ──────────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    if (verb === 'use') {
      if (noun === 'phone' && room === 'bedroom') {
        say("\nYou check the phone. There's a nine-month-old notification from the council about a bypass. You dismiss it.\n\nIn retrospect, this was a mistake.");
      } else if (noun === 'towel' && hasItem('towel')) {
        say("\nYou hold the towel. The words DON'T PANIC stare up at you in large, friendly letters. You feel slightly less panicked.");
      } else if ((noun === 'device' || noun === 'thumb') && hasItem('device')) {
        say("\nTry PRESS GREEN BUTTON.");
      } else {
        say("\nYou can't use that here.");
      }
      commit(); return;
    }

    // ── UNKNOWN VERB ─────────────────────────────────────────────────────
    const unknownMessages = [
      "I don't understand that. (The parser is limited, but then, so is the universe.)",
      "That's not a verb I recognize. Try HELP for a list of things I do understand.",
      "I have no idea what you mean by that. Neither do you, probably.",
      "The parser stares at you blankly. You stare back. Neither of you blinks.",
    ];
    say('\n' + unknownMessages[Math.floor(Math.random() * unknownMessages.length)]);
    commit();
  }, [getRoomDesc]);

  // ── Trigger device drop in lane after delay ─────────────────────────
  useEffect(() => {
    if (currentRoom === 'lane' && !flags.deviceDropped) {
      const timer = setTimeout(() => {
        const lines = [
          { text: '', type: 'normal' },
          { text: "Ford is staring at the sky. He fumbles in his satchel and pulls out a small black device with a green button.", type: 'normal' },
          { text: '', type: 'normal' },
          { text: "\"Here,\" he says urgently. \"Sub-Etha Sens-O-Matic. Electronic thumb. When you see the ships — and you WILL see the ships — PRESS THE GREEN BUTTON.\"", type: 'normal' },
          { text: '', type: 'normal' },
          { text: "He drops the DEVICE on the ground at your feet.", type: 'normal' },
          { text: '', type: 'normal' },
          { text: "(TAKE the DEVICE, then PRESS GREEN BUTTON.)", type: 'hint' },
        ];
        setOutputLines(prev => [...prev, ...lines]);
        setFlags(f => ({ ...f, deviceDropped: true }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentRoom, flags.deviceDropped]);

  // ── KEYBOARD HANDLER ─────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    // Prevent default for most keys to stop page scrolling etc.
    if (e.key === 'F5' || e.key === 'F12' || (e.ctrlKey && e.key === 'r')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    // Title screen: any key to start
    if (titleScreen) {
      setTitleScreen(false);
      return;
    }

    if (e.key === 'Enter') {
      const cmd = inputTextRef.current.trim();
      if (cmd) {
        processCommand(cmd);
        setInputText('');
      }
    } else if (e.key === 'Backspace') {
      setInputText(prev => prev.slice(0, -1));
    } else if (e.key === 'Escape') {
      processCommand('quit');
    } else if (e.key.length === 1) {
      setInputText(prev => prev + e.key);
    }
  }, [processCommand, titleScreen]);

  // ── Render ───────────────────────────────────────────────────────────
  if (titleScreen) {
    return (
      <div
        className="terminal-game-container"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'pre',
          lineHeight: '1.2',
          textAlign: 'center',
          color: '#5bf870',
        }}
      >
        <div style={{ fontSize: '0.55em', fontWeight: 'bold' }}>{TITLE_ART}</div>
        <div style={{ marginTop: '24px', opacity: 0.6, fontSize: '0.85em', animation: 'pulse 2s ease-in-out infinite' }}>
          PRESS ANY KEY TO BEGIN
        </div>
      </div>
    );
  }

  return (
    <div
      className="terminal-game-container hhg-hud"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* ── Main text area ── */}
      <div className="hhg-main">
        <div className="hhg-output" ref={outputRef}>
          {outputLines.map((line, i) => {
            let style = {};
            if (line.type === 'room') {
              style = { color: '#5bf870', fontWeight: 'bold', fontSize: '1.1em' };
            } else if (line.type === 'title') {
              style = { color: '#5bf870', fontWeight: 'bold' };
            } else if (line.type === 'input') {
              style = { color: '#2e7938', opacity: 0.7 };
            } else if (line.type === 'hint') {
              style = { color: '#2e7938', fontStyle: 'italic' };
            } else if (line.type === 'divider') {
              style = { color: '#5bf870', opacity: 0.5 };
            } else if (line.type === 'announcement') {
              style = { color: '#5bf870', fontWeight: 'bold' };
            }
            return <div key={i} style={style}>{line.text}</div>;
          })}
        </div>
        <div className="hhg-prompt">
          <span>&gt;</span>
          <span>
            {inputText}
            <span className="hhg-cursor" />
          </span>
        </div>
      </div>

      {/* ── Side panel — BBC Guide screen ── */}
      <div className="hhg-sidebar">
        <div className="hhg-guide-screen">
          <div className="hhg-guide-header">
            <span className="hhg-guide-label">THE GUIDE</span>
            <div className="hhg-guide-header-btns">
              <button
                onClick={(e) => { e.stopPropagation(); setGuideEnlarged(true); }}
                className="hhg-guide-btn"
                title="Enlarge"
                disabled={guideOff}
              >⤢</button>
              <button
                onClick={(e) => { e.stopPropagation(); setGuideOff(v => !v); }}
                className={`hhg-guide-btn ${guideOff ? 'hhg-guide-btn--off' : ''}`}
                title={guideOff ? 'Turn on' : 'Turn off'}
              >{guideOff ? '○' : '●'}</button>
            </div>
          </div>
          <div className="hhg-guide-viewport">
            {guideOff ? (
              <div className="hhg-guide-static" />
            ) : (
              <img
                src={GUIDE_IMAGES[guideImg]}
                alt="The Hitchhiker's Guide"
                className="hhg-guide-img"
              />
            )}
          </div>
          {!guideOff && (
            <div className="hhg-guide-controls">
              <button
                onClick={(e) => { e.stopPropagation(); setGuideImg(i => (i - 1 + GUIDE_IMAGES.length) % GUIDE_IMAGES.length); }}
                className="hhg-guide-btn"
              >◀</button>
              <span className="hhg-guide-counter">{guideImg + 1}/{GUIDE_IMAGES.length}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setGuideImg(i => (i + 1) % GUIDE_IMAGES.length); }}
                className="hhg-guide-btn"
              >▶</button>
            </div>
          )}
        </div>
        <div className="hhg-sidebar-info">
          <div className="hhg-sidebar-label">LOCATION</div>
          <div className="hhg-sidebar-value">{ROOMS[currentRoom]?.name || '???'}</div>
          <div className="hhg-sidebar-label">INVENTORY</div>
          <div className="hhg-sidebar-value">
            {inventory.length === 0 ? 'EMPTY' : inventory.map(it => it.toUpperCase()).join(', ')}
          </div>
        </div>
      </div>

      {/* ── Enlarged image modal ── */}
      {guideEnlarged && (
        <div className="hhg-lightbox" onClick={() => setGuideEnlarged(false)}>
          <div className="hhg-lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <div className="hhg-lightbox-header">
              <span>THE HITCHHIKER'S GUIDE TO THE GALAXY</span>
              <button className="hhg-guide-btn" onClick={() => setGuideEnlarged(false)}>✕</button>
            </div>
            <img
              src={GUIDE_IMAGES[guideImg]}
              alt="The Hitchhiker's Guide"
              className="hhg-lightbox-img"
            />
            <div className="hhg-guide-controls">
              <button
                onClick={() => setGuideImg(i => (i - 1 + GUIDE_IMAGES.length) % GUIDE_IMAGES.length)}
                className="hhg-guide-btn"
              >◀</button>
              <span className="hhg-guide-counter">{guideImg + 1}/{GUIDE_IMAGES.length}</span>
              <button
                onClick={() => setGuideImg(i => (i + 1) % GUIDE_IMAGES.length)}
                className="hhg-guide-btn"
              >▶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HitchhikerGame;
