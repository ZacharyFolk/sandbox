import { useEffect, useRef, useContext, useState } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

// Import key sounds
import key1 from '../../sounds/key1.mp3';
import key2 from '../../sounds/key2.mp3';
import key3 from '../../sounds/key3.mp3';
import key4 from '../../sounds/key4.mp3';

const keySounds = [key1, key2, key3, key4];

// Fake hacker content
const codeSnippets = [
  'for (int i = 0; i < MAX_BUFFER; i++) { inject(payload[i]); }',
  'if (bypass_firewall(0x7fff)) { grant_access(ROOT); }',
  'while (!authenticated) { brute_force(hash, salt); }',
  'memcpy(target, shellcode, sizeof(shellcode));',
  'SELECT * FROM users WHERE admin=1; DROP TABLE logs;--',
  'ssh -L 4444:localhost:22 root@target.node',
  'nmap -sS -sV -O -p- 192.168.1.0/24',
  'cat /etc/shadow | hashcat -m 1800 -a 0',
  'iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
  'chmod 777 /usr/bin/sudo && chown root:root',
  'curl -X POST -d "cmd=whoami" http://target/shell.php',
  'openssl enc -aes-256-cbc -salt -in secrets.txt',
  'nc -lvnp 4444 -e /bin/bash',
  'python3 -c "import pty; pty.spawn(\'/bin/bash\')"',
  'echo "* * * * * /tmp/backdoor.sh" >> /var/spool/cron/root',
];

const hackerMessages = [
  'ESTABLISHING SECURE CONNECTION...',
  'BYPASSING FIREWALL...',
  'INJECTING PAYLOAD...',
  'DECRYPTING HASH...',
  'ACCESS GRANTED',
  'FIREWALL BYPASSED',
  'ROOT ACCESS OBTAINED',
  'DOWNLOADING DATABASE...',
  'ERASING LOGS...',
  'SPOOFING MAC ADDRESS...',
  'TUNNELING THROUGH PROXY...',
  'CRACKING ENCRYPTION...',
  'INTERCEPTING PACKETS...',
  'DEPLOYING ROOTKIT...',
  'ESCALATING PRIVILEGES...',
];

const generateIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateHex = (length) => {
  return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const getRandomLine = () => {
  const types = ['code', 'message', 'ip', 'hex', 'progress'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'code':
      return `> ${codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}`;
    case 'message':
      return `[*] ${hackerMessages[Math.floor(Math.random() * hackerMessages.length)]}`;
    case 'ip':
      return `[+] Connecting to ${generateIP()}:${Math.floor(Math.random() * 65535)}...`;
    case 'hex':
      return `0x${generateHex(8)}: ${generateHex(32)}`;
    case 'progress':
      const percent = Math.floor(Math.random() * 100);
      const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
      return `[${bar}] ${percent}%`;
    default:
      return `> ${codeSnippets[0]}`;
  }
};

const Hacking = () => {
  const containerRef = useRef(null);
  const outputRef = useRef(null);
  const { enterGameMode, exitGameMode, updateCommand } = useContext(TerminalContext);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [targetLine, setTargetLine] = useState('[*] INITIATING HACK SEQUENCE...');
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const audioRefs = useRef([]);

  // Preload audio
  useEffect(() => {
    audioRefs.current = keySounds.map((src) => {
      const audio = new Audio(src);
      audio.volume = 0.3;
      return audio;
    });
  }, []);

  const playKeySound = () => {
    const audio = audioRefs.current[Math.floor(Math.random() * audioRefs.current.length)];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  // Enter game mode on mount
  useEffect(() => {
    console.log('Hacking component mounted');
    enterGameMode();
    if (containerRef.current) {
      containerRef.current.focus();
    }
    return () => {
      exitGameMode();
    };
  }, [enterGameMode, exitGameMode]);

  // Main typing loop
  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      if (charIndex < targetLine.length) {
        // Still typing current line
        setCurrentLine(targetLine.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        playKeySound();
      } else {
        // Finished line, start new one
        setLines(prev => [...prev.slice(-50), currentLine]);
        setCurrentLine('');
        setCharIndex(0);
        setTargetLine(getRandomLine());
      }
    }, 25 + Math.random() * 40);

    return () => clearTimeout(timer);
  }, [charIndex, targetLine, isTyping, currentLine]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  // Handle ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsTyping(false);
      exitGameMode();
      updateCommand('clear');
    }
  };

  return (
    <div
      className="hacking-container"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="hacking-header">
        <span className="hacking-title">
          <span className="blink">[CLASSIFIED]</span> MAINFRAME ACCESS
        </span>
        <span className="hacking-exit-hint">Press ESC to abort</span>
      </div>
      <div className="hacking-output" ref={outputRef}>
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`hacking-line ${line.includes('ACCESS GRANTED') || line.includes('BYPASSED') || line.includes('OBTAINED') ? 'success' : ''}`}
          >
            {line}
          </div>
        ))}
        <div className="hacking-line current">
          {currentLine}
          <span className="hacking-cursor">█</span>
        </div>
      </div>
    </div>
  );
};

export default Hacking;
