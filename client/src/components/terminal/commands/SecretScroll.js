import { useEffect, useRef, useState } from 'react';

const ALL_LINES = [
  'INITIALIZING SECURE CHANNEL . . .',
  'AUTHENTICATION: ████████████████ 100%',
  'CLEARANCE LEVEL 9 — GRANTED',
  'ACCESSING CLASSIFIED ARCHIVE . . .',
  '─────────────────────────────────────────────────────',
  'PROJECT CODENAME: [REDACTED] / NIGHTSHADE-7',
  'STATUS:          ██████████████░░ ACTIVE',
  'ASSIGNED:        DIV-6 / UNIT-ZETA',
  'LAST MODIFIED:   2025-11-04 03:17:42 UTC',
  '─────────────────────────────────────────────────────',
  '  SCHEMATIC: MK-VII RESONANCE ARRAY',
  '',
  '  ╔══════════════════════════════════════╗',
  '  ║  ┌────┐  ┌────┐  ┌────┐  ┌────┐   ║',
  '  ║  │▓▓▓▓│  │░░░░│  │▓▓▓▓│  │░░░░│   ║',
  '  ║  └──┬─┘  └──┬─┘  └──┬─┘  └──┬─┘   ║',
  '  ║     │       │        │        │     ║',
  '  ║  ╔══╧═══════╧════════╧════════╧══╗  ║',
  '  ║  ║  ▒▒▒▒▒▒▒ CORE BUS ▒▒▒▒▒▒▒▒  ║  ║',
  '  ║  ╚═══════════════════════════════╝  ║',
  '  ║          ▼ OUTPUT  ▼               ║',
  '  ║    ┌──────────────────────┐        ║',
  '  ║    │  ◈  EMITTER STAGE    │        ║',
  '  ║    └──────────────────────┘        ║',
  '  ╚══════════════════════════════════════╝',
  '',
  'TELEMETRY DUMP — NODE 0x3FA2:',
  'FF A0 3C 12 B4 E7 09 3F  2A 8D C1 56 F0 1B 7E 44',
  '3B 90 C4 DE 82 11 6A FC  05 73 A8 2F 9D 4E B7 C0',
  'D7 4C 00 81 A3 6E F5 18  BB 29 7D E0 43 9A 51 F2',
  '06 CC 8B 37 EA 14 70 9C  55 D1 B8 3E 67 A9 0D 4F',
  '─────────────────────────────────────────────────────',
  'TARGETING SOLUTION:',
  '  ORIGIN:      47°36′12″N  122°19′44″W',
  '  VECTOR:      034° / 2.4km',
  '  ELEVATION:   +312m ASL',
  '  LOCK STATUS: ◉ ACQUIRED',
  '─────────────────────────────────────────────────────',
  '  BLUEPRINT: SIGMA CONTAINMENT SHELL',
  '',
  '         ___________',
  '        /     A     \\',
  '       / ─────────── \\',
  '      /  ║  [PWR]  ║  \\',
  '     /   ║  ╔═══╗  ║   \\',
  '    /    ║  ║ ◈ ║  ║    \\',
  '    \\    ║  ╚═══╝  ║    /',
  '     \\   ║  [GND]  ║   /',
  '      \\  ─────────── /',
  '       \\             /',
  '        \\___________/',
  '          REV 4.1-C',
  '',
  '─────────────────────────────────────────────────────',
  'SUBSYSTEM INTEGRITY SCAN:',
  '  [PASS] POWER REGULATION  ........... 98.7%',
  '  [PASS] THERMAL MANAGEMENT .......... 94.2%',
  '  [PASS] QUANTUM ISOLATION  .......... 99.1%',
  '  [WARN] SECTOR 7 SHIELDING .......... 61.4%  ⚠',
  '  [PASS] PRIMARY COOLANT    ........... 100%',
  '─────────────────────────────────────────────────────',
  'DECRYPTING PAYLOAD . . .',
  '  KEY:  █████████████████████████ [REDACTED]',
  '  SIG:  3A:F7:0C:2B:99:D4:11:E8:AA:36:00:1C:42:D7:8F:55',
  '─────────────────────────────────────────────────────',
  'MISSION LOG FRAGMENT — EYES ONLY:',
  '  "Phase 3 extraction complete. Asset secured.',
  '   Recommend immediate transfer to Site-Kilo.',
  '   Do not discuss via standard channels."',
  '─────────────────────────────────────────────────────',
  '  CIRCUIT MAP: NODE CLUSTER 9',
  '',
  '   +Vcc',
  '    │',
  '   [R1 4.7kΩ]',
  '    │         ┌────────┐',
  '    ├─────────┤ BASE   │',
  '    │         │ Q1 NPN ├──── OUTPUT',
  '   [R2 1kΩ]   │ EMIT.  │',
  '    │         └───┬────┘',
  '   GND            │',
  '                 GND',
  '',
  '─────────────────────────────────────────────────────',
  'WARNING: UNAUTHORIZED ACCESS DETECTED',
  'INITIATING TRACE PROTOCOL . . .',
  'SOURCE IP:    [OBFUSCATED]',
  'COUNTERMEASURE: DEPLOYING . . . ████████████ DONE',
  '─────────────────────────────────────────────────────',
  'PURGING SESSION DATA . . .',
  'OVERWRITING BUFFER . . . ████████████████████ DONE',
  'CONNECTION TERMINATED.',
  '─────────────────────────────────────────────────────',
];

const SecretScroll = ({ onDone }) => {
  const [lines, setLines] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < ALL_LINES.length) {
        setLines((prev) => [...prev, ALL_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onDone, 900);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [lines]);

  return (
    <pre className="secret-scroll">
      {lines.map((line, i) => (
        <div key={i} className="secret-line">{line || '\u00A0'}</div>
      ))}
      <div ref={bottomRef} />
    </pre>
  );
};

export default SecretScroll;
