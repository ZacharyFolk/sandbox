import { useContext, useEffect } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

const commands = [
  { label: 'about',    hint: 'who is this person' },
  { label: 'projects', hint: 'things I built'      },
  { label: 'contact',  hint: 'get in touch'        },
  { label: 'photos',   hint: 'photography'         },
  { label: 'latest',   hint: 'latest blog post'    },
];

const QuickCommandPanel = ({ onClose }) => {
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const run = (cmd) => {
    updateCommand(cmd);
    updateInput('');
    onClose();
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="qcp-backdrop" onClick={onClose}>
      <div className="qcp-panel" onClick={(e) => e.stopPropagation()}>
        <div className="qcp-header">
          <span className="qcp-title">&gt;_ commands</span>
          <button className="qcp-close" onClick={onClose}>✕</button>
        </div>
        <ul className="qcp-list">
          {commands.map(({ label, hint }) => (
            <li key={label} className="qcp-item" onClick={() => run(label)}>
              <span className="qcp-label">{label}</span>
              <span className="qcp-hint">{hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuickCommandPanel;
