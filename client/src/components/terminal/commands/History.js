import Typist from 'react-typist-component';

const History = ({ history }) => {
  if (!history || !history.length) {
    return (
      <Typist typingDelay={4} cursor={null}>
        <pre className="nasa-report">{`
╔══════════════════════════════════════════════════════════════╗
║           ██  COMMAND LOG — SESSION ARCHIVE  ██              ║
║                  FOLK.CODES TERMINAL  MK-II                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   NO COMMANDS RECORDED IN LOCAL STORAGE.                     ║
║                                                              ║
║   BEGIN TYPING TO POPULATE THE LOG.                          ║
║                                                              ║
║   *** ARCHIVE — EMPTY ***                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`}</pre>
      </Typist>
    );
  }

  const recent = history.slice(-50);
  const offset = Math.max(0, history.length - 50);
  const lines = recent.map((cmd, i) => {
    const num = String(offset + i + 1).padStart(5, ' ');
    return `║   ${num}  ${cmd.padEnd(52, ' ')}║`;
  });

  return (
    <Typist typingDelay={2} cursor={null}>
      <pre className="nasa-report">{`
╔══════════════════════════════════════════════════════════════╗
║           ██  COMMAND LOG — SESSION ARCHIVE  ██              ║
║                  FOLK.CODES TERMINAL  MK-II                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   DISPLAYING LAST ${String(recent.length).padEnd(3, ' ')} OF ${String(history.length).padEnd(5, ' ')} RECORDED COMMANDS.            ║
║                                                              ║
${lines.join('\n')}
║                                                              ║
║   USE ↑/↓ ARROWS TO CYCLE THROUGH HISTORY.                  ║
║                                                              ║
║   *** ARCHIVE — ${String(history.length).padEnd(5, ' ')} ENTRIES ***                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`}</pre>
    </Typist>
  );
};

export default History;
