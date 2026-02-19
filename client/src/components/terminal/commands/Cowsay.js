const QUOTES = [
  "I THINK, THEREFORE I MOO.",
  "HAVE YOU TRIED TURNING IT\nOFF AND ON AGAIN?",
  "THERE ARE 10 TYPES OF COWS:\nTHOSE WHO KNOW BINARY\nAND THOSE WHO DON'T.",
  "THE CAKE IS A LIE.\nBUT THE GRASS IS REAL.",
  "IN A FIELD OF HORSES,\nBE A COW.",
  "sudo make me a sandwich",
  "IT WORKS ON MY PASTURE.",
  "FIRST, SOLVE THE PROBLEM.\nTHEN, WRITE THE CODE.\nTHEN, MOO.",
  "DEBUGGING: BEING THE DETECTIVE\nIN A CRIME MOVIE WHERE YOU\nARE ALSO THE MURDERER.",
  "THERE IS NO PLACE LIKE\n127.0.0.1",
  "A SQL QUERY WALKS INTO A BAR.\nSEES TWO TABLES AND ASKS:\n'CAN I JOIN YOU?'",
  "LOREM IPSUM DOLOR SIT AMET.\nJUST KIDDING. MOO.",
  "TALK IS CHEAP.\nSHOW ME THE COW.",
  "BEFORE SOFTWARE CAN BE\nREUSABLE IT FIRST HAS TO\nBE USABLE.",
  "THE BEST ERROR MESSAGE IS\nTHE ONE THAT NEVER SHOWS UP.",
];

function makeCow(text) {
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  const padded = lines.map(l => l.padEnd(maxLen));
  const border = '─'.repeat(maxLen + 2);

  let balloon;
  if (lines.length === 1) {
    balloon = `  ┌${border}┐\n  │ ${padded[0]} │\n  └${border}┘`;
  } else {
    const top = `  ┌${border}┐`;
    const bottom = `  └${border}┘`;
    const mid = padded.map((l, i) => {
      if (i === 0) return `  │ ${l} │`;
      if (i === lines.length - 1) return `  │ ${l} │`;
      return `  │ ${l} │`;
    }).join('\n');
    balloon = `${top}\n${mid}\n${bottom}`;
  }

  const cow = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

  return `${balloon}\n${cow}`;
}

export default function Cowsay() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="cowsay-container">
      <pre className="cowsay-art">{makeCow(quote)}</pre>
      <div className="cowsay-footer">
        cowsay v4.20 — AGRICULTURAL WISDOM MODULE — FOLK.CODES MK-II
      </div>
    </div>
  );
}
