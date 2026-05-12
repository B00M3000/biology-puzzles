import { useState, useEffect, useRef } from 'react';
import { Trophy, Brain, Zap, Timer, ChevronUp, ChevronDown, Check, X, RefreshCw, ArrowLeft, Sparkles, ListOrdered, Grid3x3, Boxes, Loader2, GripVertical } from 'lucide-react';

// ============ GAME DATA ============

const BINS = [
  { id: 'true', name: 'True', accent: '#15803d', bg: '#dcfce7' },
  { id: 'false', name: 'False', accent: '#c2410c', bg: '#fee2e2' },
];

const BIN_ITEMS = [
  // True
  { id: 's1', label: 'Enzymes lower the activation energy of a reaction.', bin: 'true', explain: 'Right — that\'s the whole mechanism.' },
  { id: 's2', label: 'Enzymes are not consumed in the reactions they catalyze.', bin: 'true', explain: 'Correct — catalysts are reused many times.' },
  { id: 's3', label: 'Most enzymes are proteins folded into a specific 3D shape.', bin: 'true', explain: 'Yes — shape determines function.' },
  { id: 's4', label: 'The active site is where the substrate binds.', bin: 'true', explain: 'Correct — induced fit happens here.' },
  { id: 's5', label: 'At rest, the inside of a neuron is more negative than the outside.', bin: 'true', explain: 'Yes — about −70 mV.' },
  { id: 's6', label: 'Voltage-gated Na⁺ channels open during depolarization.', bin: 'true', explain: 'Correct — that\'s what causes the spike.' },
  { id: 's7', label: 'K⁺ flowing out of the cell causes repolarization.', bin: 'true', explain: 'Yes — K⁺ efflux restores the negative interior.' },
  { id: 's8', label: 'Ca²⁺ entry at the axon terminal triggers neurotransmitter release.', bin: 'true', explain: 'Correct — Ca²⁺ binds vesicle proteins to fuse them.' },
  // False
  { id: 's9', label: 'Enzymes change the overall energy released by a reaction.', bin: 'false', explain: 'False — enzymes only lower activation energy, not ΔG.' },
  { id: 's10', label: 'Enzymes work equally well at any temperature or pH.', bin: 'false', explain: 'False — each enzyme has optimal conditions; extremes denature them.' },
  { id: 's11', label: 'An enzyme is used up after catalyzing one reaction.', bin: 'false', explain: 'False — enzymes are reusable; that\'s why they\'re catalysts.' },
  { id: 's12', label: 'Enzymes can catalyze any chemical reaction.', bin: 'false', explain: 'False — they\'re highly specific to their substrate.' },
  { id: 's13', label: 'The Na⁺/K⁺ pump moves ions down their concentration gradients.', bin: 'false', explain: 'False — it actively pumps against gradients using ATP.' },
  { id: 's14', label: 'Action potentials vary in size depending on stimulus strength.', bin: 'false', explain: 'False — they\'re all-or-nothing; strength is coded by frequency.' },
  { id: 's15', label: 'Na⁺ flows out of the cell during depolarization.', bin: 'false', explain: 'False — Na⁺ flows IN, making the inside positive.' },
  { id: 's16', label: 'Neurotransmitters travel down the axon to reach the next neuron.', bin: 'false', explain: 'False — the action potential travels down the axon; neurotransmitters cross the synapse.' },
];

const CONNECTIONS_GROUPS = [
  { name: 'Enzyme catalysis components', terms: ['Active site', 'Substrate', 'Cofactor', 'Product'], accent: '#8d7000', bg: '#f9df6d' },
  { name: 'Action potential phases', terms: ['Resting', 'Depolarization', 'Repolarization', 'Hyperpolarization'], accent: '#4a6a1f', bg: '#a0c35a' },
  { name: 'Ions in neuron signaling', terms: ['Sodium', 'Potassium', 'Calcium', 'Chloride'], accent: '#2f4a99', bg: '#b0c4ef' },
  { name: 'Synaptic transmission parts', terms: ['Vesicle', 'Neurotransmitter', 'Receptor', 'Synaptic cleft'], accent: '#7a4f87', bg: '#ba81c5' },
];

const ORDER_STEPS = [
  { id: 1, text: 'Neuron at rest (~−70 mV); Na⁺/K⁺ pump maintains gradients' },
  { id: 2, text: 'Stimulus depolarizes membrane to threshold (~−55 mV)' },
  { id: 3, text: 'Voltage-gated Na⁺ channels open; Na⁺ rushes in' },
  { id: 4, text: 'Membrane reaches peak depolarization (~+30 mV)' },
  { id: 5, text: 'Na⁺ channels inactivate; voltage-gated K⁺ channels open' },
  { id: 6, text: 'K⁺ flows out, repolarizing the membrane' },
  { id: 7, text: 'Brief hyperpolarization, then return to resting potential' },
];

// ============ HELPERS ============

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const BIN_SORT_TIME = 75;

// ============ STYLES ============

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=DM+Sans:wght@400;500;700&family=Libre+Franklin:wght@500;700;800;900&display=swap');
  
  .bio-app * { box-sizing: border-box; }
  .bio-app { font-family: 'DM Sans', sans-serif; color: #1a1a2e; }
  .bio-display { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
  
  .bio-bg {
    background-color: #f4ede1;
    background-image: 
      radial-gradient(circle at 20% 10%, rgba(232, 74, 63, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(13, 139, 139, 0.05) 0%, transparent 40%);
    min-height: 100vh;
  }
  
  .bio-card {
    background: #fdfaf3;
    border: 1.5px solid #1a1a2e;
    border-radius: 14px;
    box-shadow: 4px 4px 0 #1a1a2e;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  
  .bio-card-hover:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #1a1a2e;
  }
  
  .bio-card-press:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1a1a2e;
  }
  
  .bio-btn {
    background: #1a1a2e;
    color: #f4ede1;
    border: 1.5px solid #1a1a2e;
    border-radius: 10px;
    padding: 10px 18px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 3px 3px 0 #e84a3f;
  }
  
  .bio-btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #e84a3f; }
  .bio-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #e84a3f; }
  .bio-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  
  .bio-chip {
    border: 1.5px solid #1a1a2e;
    border-radius: 999px;
    background: #fdfaf3;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }
  
  .bio-chip-selected {
    background: #1a1a2e;
    color: #f4ede1;
    transform: scale(0.96);
  }
  
  .bio-chip-correct {
    background: #15803d !important;
    color: #fff !important;
    animation: pop 0.4s ease;
  }
  
  .bio-chip-wrong {
    background: #c2410c !important;
    color: #fff !important;
    animation: shake 0.4s ease;
  }
  
  @keyframes pop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .bio-slide-in { animation: slideIn 0.3s ease; }
  
  /* NYT Connections-style */
  .bio-nyt-font { font-family: 'Libre Franklin', sans-serif; color: #1a1a1a; }
  
  .bio-nyt-tile {
    background: #efefe6;
    border: none;
    border-radius: 7px;
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 800;
    color: #1a1a1a;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.01em;
  }
  .bio-nyt-tile:hover:not(:disabled) { background: #e6e5dc; }
  .bio-nyt-tile:active { transform: scale(0.97); }
  .bio-nyt-tile-selected { background: #5a594e !important; color: #efefe6 !important; }
  
  .bio-nyt-pill {
    border: 1.5px solid #1a1a1a;
    border-radius: 999px;
    background: transparent;
    padding: 10px 22px;
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.15s;
  }
  .bio-nyt-pill:hover:not(:disabled) { background: #1a1a1a; color: #efefe6; }
  .bio-nyt-pill:disabled { opacity: 0.3; cursor: not-allowed; border-color: #1a1a1a55; color: #1a1a1a55; }
  
  .bio-grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    z-index: 0;
  }
`;

// ============ HUB ============

function Hub({ onNav }) {
  const games = [
    { id: 'binsort', title: 'True or False', desc: 'Race against the clock. Sort 16 statements about enzymes and neurons into the right bin.', icon: Boxes, accent: '#e84a3f', time: '75s' },
    { id: 'connections', title: 'Connections', desc: 'Find the four hidden groups of four. Four mistakes allowed.', icon: Grid3x3, accent: '#0d8b8b', time: '∞' },
    { id: 'ordering', title: 'Action Potential', desc: 'Arrange the steps of nerve impulse transmission in the correct order.', icon: ListOrdered, accent: '#d4a437', time: '∞' },
  ];
  return (
    <div className="bio-slide-in" style={{ padding: '24px 16px 80px', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 36, paddingTop: 12 }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: '#1a1a2e', color: '#f4ede1', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', borderRadius: 999, marginBottom: 16 }}>
          BIO 101 · STUDY HALL
        </div>
        <h1 className="bio-display" style={{ fontSize: 'clamp(36px, 8vw, 56px)', fontWeight: 800, margin: 0, lineHeight: 1 }}>
          Enzymes <span style={{ fontStyle: 'italic', color: '#e84a3f' }}>&</span> Neurons
        </h1>
        <p style={{ fontSize: 15, opacity: 0.7, marginTop: 12, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
          Three puzzles. One leaderboard. Pick your poison.
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div key={g.id} className="bio-card bio-card-hover bio-card-press" onClick={() => onNav(g.id)} style={{ padding: 20, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flexShrink: 0, width: 52, height: 52, background: g.accent, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #1a1a2e' }}>
                <Icon size={26} color="#fdfaf3" strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <h2 className="bio-display" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{g.title}</h2>
                  <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 500 }}>· {g.time}</span>
                </div>
                <p style={{ fontSize: 13.5, margin: '4px 0 0', opacity: 0.7, lineHeight: 1.4 }}>{g.desc}</p>
              </div>
            </div>
          );
        })}
        
        <div className="bio-card bio-card-hover bio-card-press" onClick={() => onNav('leaderboard')} style={{ padding: 20, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center', background: '#1a1a2e', color: '#f4ede1', marginTop: 8 }}>
          <div style={{ flexShrink: 0, width: 52, height: 52, background: '#f4ede1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #f4ede1' }}>
            <Trophy size={26} color="#1a1a2e" strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="bio-display" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Leaderboard</h2>
            <p style={{ fontSize: 13.5, margin: '4px 0 0', opacity: 0.7 }}>See who's on top across all three games.</p>
          </div>
        </div>
      </div>
      
      <p style={{ textAlign: 'center', fontSize: 11, opacity: 0.4, marginTop: 32, fontStyle: 'italic' }}>
        Built for Thomas · scores are shared with anyone using this puzzle
      </p>
    </div>
  );
}

// ============ HEADER ============

function GameHeader({ title, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <button onClick={onBack} className="bio-card bio-card-press" style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, background: '#fdfaf3', boxShadow: '3px 3px 0 #1a1a2e' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h2 className="bio-display" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
      <div style={{ minWidth: 70, textAlign: 'right' }}>{right}</div>
    </div>
  );
}

// ============ BIN SORT GAME ============

function BinSortGame({ onBack, onScore }) {
  const [items, setItems] = useState(() => shuffle(BIN_ITEMS));
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BIN_SORT_TIME);
  const [status, setStatus] = useState('playing'); // playing | done
  const [feedback, setFeedback] = useState(null); // { correct, explain } | null
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);
  
  const current = items[idx];
  
  // timer
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setStatus('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);
  
  const answer = (binId) => {
    if (locked || !current || status !== 'playing') return;
    setLocked(true);
    const correct = current.bin === binId;
    if (correct) {
      setCorrectCount(c => c + 1);
      setFeedback({ correct: true, explain: current.explain });
    } else {
      setTimeLeft(t => Math.max(0, t - 3));
      setFeedback({ correct: false, explain: current.explain });
    }
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);
      if (idx + 1 >= items.length) {
        setStatus('done');
      } else {
        setIdx(idx + 1);
      }
    }, correct ? 700 : 1400);
  };
  
  const finalScore = correctCount * 100 + (timeLeft * 10);
  
  return (
    <div>
      <GameHeader title="True or False" onBack={onBack} right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
          <Timer size={16} color={timeLeft < 15 ? '#e84a3f' : '#1a1a2e'} />
          <span className="bio-display" style={{ fontWeight: 700, fontSize: 18, color: timeLeft < 15 ? '#e84a3f' : '#1a1a2e' }}>{timeLeft}s</span>
        </div>
      } />
      
      <div style={{ padding: '0 16px 80px', maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {status === 'playing' && current ? (
          <>
            <div style={{ fontSize: 12, opacity: 0.6, textAlign: 'center', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
              Statement {idx + 1} of {items.length}  ·  Wrong = −3s
            </div>
            
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 18 }}>
              {items.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < idx ? '#1a1a2e' : i === idx ? '#e84a3f' : '#1a1a2e22', maxWidth: 18 }} />
              ))}
            </div>
            
            {/* Statement card */}
            <div key={current.id} className="bio-card bio-slide-in" style={{ 
              padding: '32px 24px', 
              marginBottom: 20, 
              minHeight: 180,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: feedback?.correct === true ? '#dcfce7' : feedback?.correct === false ? '#fee2e2' : '#fdfaf3',
              borderColor: feedback?.correct === true ? '#15803d' : feedback?.correct === false ? '#c2410c' : '#1a1a2e',
              boxShadow: feedback?.correct === true ? '5px 5px 0 #15803d' : feedback?.correct === false ? '5px 5px 0 #c2410c' : '5px 5px 0 #1a1a2e',
              transition: 'all 0.3s',
            }}>
              {feedback ? (
                <div style={{ textAlign: 'center' }}>
                  {feedback.correct ? <Check size={32} color="#15803d" /> : <X size={32} color="#c2410c" />}
                  <div className="bio-display" style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: feedback.correct ? '#15803d' : '#c2410c' }}>
                    {feedback.correct ? 'Correct' : 'Not quite'}
                  </div>
                  <div style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.4, opacity: 0.85 }}>{feedback.explain}</div>
                </div>
              ) : (
                <div className="bio-display" style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: 500, textAlign: 'center', lineHeight: 1.35 }}>
                  "{current.label}"
                </div>
              )}
            </div>
            
            {/* True / False bins */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {BINS.map(bin => (
                <button key={bin.id} onClick={() => answer(bin.id)} disabled={locked} className="bio-card bio-card-press" style={{ 
                  padding: '24px 12px', 
                  background: bin.bg, 
                  border: `1.5px solid ${bin.accent}`, 
                  cursor: locked ? 'default' : 'pointer',
                  boxShadow: `4px 4px 0 ${bin.accent}`,
                  opacity: locked ? 0.6 : 1,
                }}>
                  <div className="bio-display" style={{ fontWeight: 700, fontSize: 26, color: bin.accent }}>{bin.name}</div>
                </button>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', fontSize: 11, opacity: 0.5, marginTop: 16 }}>
              Score: {correctCount * 100}  ·  Correct: {correctCount} / {idx + (feedback ? 1 : 0)}
            </div>
          </>
        ) : (
          <GameComplete 
            gameKey="binsort"
            gameName="True or False"
            score={finalScore}
            extras={[
              { label: 'Correct', value: `${correctCount} / ${items.length}` },
              { label: 'Time left', value: timeLeft + 's' },
            ]}
            onPlayAgain={() => { 
              setItems(shuffle(BIN_ITEMS)); setIdx(0); 
              setTimeLeft(BIN_SORT_TIME); setStatus('playing'); 
              setCorrectCount(0); setFeedback(null); setLocked(false);
            }}
            onBack={onBack}
            onScore={onScore}
          />
        )}
      </div>
    </div>
  );
}

// ============ CONNECTIONS GAME ============

function ConnectionsGame({ onBack, onScore }) {
  const allTerms = CONNECTIONS_GROUPS.flatMap(g => g.terms.map(t => ({ term: t, groupIdx: CONNECTIONS_GROUPS.indexOf(g) })));
  const [tiles, setTiles] = useState(() => shuffle(allTerms));
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]); // array of group indices
  const [mistakes, setMistakes] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [status, setStatus] = useState('playing'); // playing | won | lost
  const [startTime] = useState(Date.now());
  const [finishTime, setFinishTime] = useState(null);
  
  const toggle = (term) => {
    if (status !== 'playing') return;
    if (selected.includes(term)) {
      setSelected(selected.filter(t => t !== term));
    } else if (selected.length < 4) {
      setSelected([...selected, term]);
    }
  };
  
  const submit = () => {
    if (selected.length !== 4) return;
    const groupIdxs = selected.map(t => tiles.find(tile => tile.term === t).groupIdx);
    const allSame = groupIdxs.every(i => i === groupIdxs[0]);
    if (allSame) {
      const newSolved = [...solved, groupIdxs[0]];
      const remainingTiles = tiles.filter(t => !selected.includes(t.term));
      setSolved(newSolved);
      setTiles(remainingTiles);
      setSelected([]);
      if (newSolved.length === 4) {
        setStatus('won');
        setFinishTime(Date.now());
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShakeKey(k => k + 1);
      if (newMistakes >= 4) {
        setStatus('lost');
        setFinishTime(Date.now());
      } else {
        setTimeout(() => setSelected([]), 600);
      }
    }
  };
  
  const elapsedSec = finishTime ? Math.round((finishTime - startTime) / 1000) : 0;
  // Score: faster + fewer mistakes = better. Max 1000 for perfect under 30s.
  const finalScore = status === 'won' 
    ? Math.max(100, 1000 - (mistakes * 150) - Math.max(0, (elapsedSec - 30) * 5))
    : 0;
  
  const reset = () => {
    setTiles(shuffle(allTerms));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setStatus('playing');
    setFinishTime(null);
  };
  
  return (
    <div>
      <GameHeader title="Connections" onBack={onBack} right={null} />
      
      <div style={{ padding: '0 16px 80px', maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {status === 'playing' && (
          <div className="bio-nyt-font" style={{ fontSize: 15, textAlign: 'center', marginBottom: 20, fontWeight: 500 }}>
            Create four groups of four!
          </div>
        )}
        
        {/* Solved rows - NYT colored bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: solved.length > 0 ? 8 : 0 }}>
          {solved.map(gIdx => {
            const group = CONNECTIONS_GROUPS[gIdx];
            return (
              <div key={gIdx} className="bio-slide-in bio-nyt-font" style={{ 
                padding: '14px 16px', 
                background: group.bg, 
                borderRadius: 7, 
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{group.name}</div>
                <div style={{ fontSize: 13, marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{group.terms.join(', ')}</div>
              </div>
            );
          })}
        </div>
        
        {/* Unsolved tile grid */}
        {status === 'playing' && (
          <div key={shakeKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {tiles.map(t => {
              const isSel = selected.includes(t.term);
              return (
                <button key={t.term} onClick={() => toggle(t.term)} 
                  className={`bio-nyt-tile ${isSel ? 'bio-nyt-tile-selected' : ''}`}
                  style={{ 
                    height: 'clamp(56px, 13vh, 140px)',
                    minWidth: 0,
                    padding: '4px',
                    fontSize: 'clamp(10px, 3.5vw, 20px)',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    animation: shakeKey > 0 && isSel ? 'shake 0.4s' : 'none',
                  }}>
                  {t.term}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Mistakes indicator - below grid */}
        {status === 'playing' && (
          <div className="bio-nyt-font" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 12,
            marginTop: 26,
            fontSize: 14,
            fontWeight: 500,
          }}>
            <span>Mistakes Remaining:</span>
            <span style={{ display: 'flex', gap: 7 }}>
              {[0,1,2,3].map(i => (
                <span key={i} style={{ 
                  width: 13, 
                  height: 13, 
                  borderRadius: '50%', 
                  background: i < (4 - mistakes) ? '#5a594e' : 'transparent',
                  border: i < (4 - mistakes) ? 'none' : '1.5px solid #5a594e55',
                  display: 'inline-block',
                  transition: 'all 0.2s',
                }} />
              ))}
            </span>
          </div>
        )}
        
        {/* Pill buttons */}
        {status === 'playing' && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <button className="bio-nyt-pill" onClick={() => setTiles(shuffle(tiles))}>Shuffle</button>
            <button className="bio-nyt-pill" onClick={() => setSelected([])} disabled={selected.length === 0}>Deselect All</button>
            <button className="bio-nyt-pill" onClick={submit} disabled={selected.length !== 4}>Submit</button>
          </div>
        )}
        
        {/* Win */}
        {status === 'won' && (
          <GameComplete
            gameKey="connections"
            gameName="Connections"
            score={finalScore}
            extras={[
              { label: 'Mistakes', value: mistakes },
              { label: 'Time', value: elapsedSec + 's' },
            ]}
            won
            onPlayAgain={reset}
            onBack={onBack}
            onScore={onScore}
          />
        )}
        
        {/* Lose - reveal remaining groups */}
        {status === 'lost' && (
          <div style={{ marginTop: 8 }}>
            {CONNECTIONS_GROUPS.map((g, idx) => {
              if (solved.includes(idx)) return null;
              return (
                <div key={idx} className="bio-nyt-font" style={{ padding: '14px 16px', background: g.bg, borderRadius: 7, textAlign: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{g.name}</div>
                  <div style={{ fontSize: 13, marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{g.terms.join(', ')}</div>
                </div>
              );
            })}
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <div className="bio-nyt-font" style={{ fontSize: 20, fontWeight: 700 }}>Better luck next time</div>
              <button className="bio-nyt-pill" onClick={reset} style={{ marginTop: 16 }}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ORDERING GAME ============

function OrderingGame({ onBack, onScore }) {
  const [order, setOrder] = useState(() => shuffle(ORDER_STEPS));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState('playing');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [finishTime, setFinishTime] = useState(null);
  
  // Drag state: { id, idx, startY, offsetY }
  const [dragState, setDragState] = useState(null);
  const cardRefs = useRef({});
  
  const onPointerDown = (e, idx, id) => {
    if (status !== 'playing') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState({ id, idx, startY: e.clientY, offsetY: 0 });
    setChecked(false);
  };
  
  const onPointerMove = (e) => {
    if (!dragState) return;
    const offsetY = e.clientY - dragState.startY;
    const cardEl = cardRefs.current[dragState.id];
    if (!cardEl) {
      setDragState({ ...dragState, offsetY });
      return;
    }
    const cardHeight = cardEl.offsetHeight + 8; // include the gap
    const indexDelta = Math.round(offsetY / cardHeight);
    const newIdx = Math.max(0, Math.min(order.length - 1, dragState.idx + indexDelta));
    
    if (newIdx !== dragState.idx) {
      // Reorder array - card under finger stays under finger
      const newOrder = [...order];
      const [moving] = newOrder.splice(dragState.idx, 1);
      newOrder.splice(newIdx, 0, moving);
      setOrder(newOrder);
      const newStartY = dragState.startY + (newIdx - dragState.idx) * cardHeight;
      setDragState({
        id: dragState.id,
        idx: newIdx,
        startY: newStartY,
        offsetY: e.clientY - newStartY,
      });
    } else {
      setDragState({ ...dragState, offsetY });
    }
  };
  
  const onPointerUp = () => {
    setDragState(null);
  };
  
  const check = () => {
    setAttempts(a => a + 1);
    setChecked(true);
    const isCorrect = order.every((step, idx) => step.id === idx + 1);
    if (isCorrect) {
      setStatus('done');
      setFinishTime(Date.now());
    }
  };
  
  const elapsedSec = finishTime ? Math.round((finishTime - startTime) / 1000) : 0;
  const finalScore = status === 'done' 
    ? Math.max(100, 1000 - ((attempts - 1) * 100) - Math.max(0, (elapsedSec - 60) * 3))
    : 0;
  
  const reset = () => {
    setOrder(shuffle(ORDER_STEPS));
    setChecked(false);
    setStatus('playing');
    setAttempts(0);
    setFinishTime(null);
  };
  
  return (
    <div>
      <GameHeader title="Action Potential" onBack={onBack} right={
        <span style={{ fontSize: 12, opacity: 0.7 }}>Attempts: {attempts}</span>
      } />
      
      <div style={{ padding: '0 16px 80px', maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {status === 'playing' ? (
          <>
            <div style={{ fontSize: 13, opacity: 0.7, textAlign: 'center', marginBottom: 14 }}>
              Drag the cards into the correct order, then check
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.map((step, idx) => {
                const isCorrect = checked && step.id === idx + 1;
                const isWrong = checked && step.id !== idx + 1;
                const isDragging = dragState?.id === step.id;
                return (
                  <div 
                    key={step.id} 
                    ref={el => { if (el) cardRefs.current[step.id] = el; }}
                    className="bio-card"
                    onPointerDown={(e) => onPointerDown(e, idx, step.id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{ 
                      padding: 12, 
                      display: 'flex', 
                      gap: 10, 
                      alignItems: 'center',
                      background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#fdfaf3',
                      borderColor: isCorrect ? '#15803d' : isWrong ? '#c2410c' : '#1a1a2e',
                      boxShadow: isDragging 
                        ? '8px 8px 0 #1a1a2e' 
                        : isCorrect ? '3px 3px 0 #15803d' : isWrong ? '3px 3px 0 #c2410c' : '3px 3px 0 #1a1a2e',
                      transform: isDragging ? `translateY(${dragState.offsetY}px) scale(1.02) rotate(-0.5deg)` : 'none',
                      transition: isDragging ? 'none' : 'background 0.3s, border-color 0.3s, box-shadow 0.2s',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      touchAction: 'none',
                      userSelect: 'none',
                      zIndex: isDragging ? 100 : 1,
                      position: 'relative',
                      opacity: isDragging ? 0.95 : 1,
                    }}
                  >
                    <div className="bio-display" style={{ flexShrink: 0, width: 28, height: 28, background: '#1a1a2e', color: '#f4ede1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{idx + 1}</div>
                    <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.35, pointerEvents: 'none' }}>{step.text}</div>
                    <GripVertical size={18} style={{ flexShrink: 0, opacity: 0.4 }} />
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
              <button className="bio-btn" onClick={() => { setOrder(shuffle(ORDER_STEPS)); setChecked(false); }} style={{ background: '#fdfaf3', color: '#1a1a2e' }}>Shuffle</button>
              <button className="bio-btn" onClick={check}>Check Order</button>
            </div>
          </>
        ) : (
          <GameComplete
            gameKey="ordering"
            gameName="Action Potential"
            score={finalScore}
            extras={[
              { label: 'Attempts', value: attempts },
              { label: 'Time', value: elapsedSec + 's' },
            ]}
            won
            onPlayAgain={reset}
            onBack={onBack}
            onScore={onScore}
          />
        )}
      </div>
    </div>
  );
}

// ============ GAME COMPLETE / SCORE ENTRY ============

function GameComplete({ gameKey, gameName, score, extras, won, onPlayAgain, onBack, onScore }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const submit = async () => {
    if (!name.trim() || submitted) return;
    setSubmitting(true);
    await onScore(gameKey, name.trim().slice(0, 20), score);
    setSubmitted(true);
    setSubmitting(false);
  };
  
  return (
    <div className="bio-slide-in" style={{ marginTop: 30, padding: 24, background: '#fdfaf3', border: '1.5px solid #1a1a2e', borderRadius: 14, textAlign: 'center', boxShadow: '5px 5px 0 #1a1a2e' }}>
      <Sparkles size={32} color="#e84a3f" style={{ margin: '0 auto' }} />
      <div className="bio-display" style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
        {won === false ? "Time's up" : 'Nicely done'}
      </div>
      <div className="bio-display" style={{ fontSize: 56, fontWeight: 800, color: '#e84a3f', lineHeight: 1, margin: '12px 0' }}>
        {score}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 13, opacity: 0.75, marginBottom: 20 }}>
        {extras.map(e => (
          <div key={e.label}>
            <div style={{ fontWeight: 600 }}>{e.value}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{e.label}</div>
          </div>
        ))}
      </div>
      
      {!submitted && score > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Save to leaderboard</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={20} 
              style={{ padding: '10px 12px', border: '1.5px solid #1a1a2e', borderRadius: 8, fontSize: 14, fontFamily: 'DM Sans', background: '#f4ede1', minWidth: 0, flex: 1, maxWidth: 200 }} />
            <button className="bio-btn" onClick={submit} disabled={!name.trim() || submitting}>
              {submitting ? <Loader2 size={14} className="bio-spin" /> : 'Save'}
            </button>
          </div>
        </div>
      )}
      {submitted && (
        <div style={{ marginBottom: 16, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          ✓ Saved to leaderboard
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="bio-btn" onClick={onPlayAgain} style={{ background: '#fdfaf3', color: '#1a1a2e' }}>
          <RefreshCw size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} /> Again
        </button>
        <button className="bio-btn" onClick={onBack}>Home</button>
      </div>
    </div>
  );
}

// ============ LEADERBOARD ============

function Leaderboard({ onBack, scores, loading }) {
  const [tab, setTab] = useState('binsort');
  const tabs = [
    { id: 'binsort', name: 'Bin Sort' },
    { id: 'connections', name: 'Connections' },
    { id: 'ordering', name: 'Action Potential' },
  ];
  
  const current = (scores[tab] || []).slice().sort((a, b) => b.score - a.score).slice(0, 10);
  
  return (
    <div>
      <GameHeader title="Leaderboard" onBack={onBack} right={null} />
      <div style={{ padding: '0 16px 80px', maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="bio-chip" style={{ 
              background: tab === t.id ? '#1a1a2e' : '#fdfaf3',
              color: tab === t.id ? '#f4ede1' : '#1a1a2e',
            }}>{t.name}</button>
          ))}
        </div>
        
        <div className="bio-card" style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
              <Loader2 size={24} className="bio-spin" style={{ margin: '0 auto' }} />
              <div style={{ marginTop: 8, fontSize: 13 }}>Loading scores...</div>
            </div>
          ) : current.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, opacity: 0.5 }}>
              <Trophy size={32} style={{ margin: '0 auto', opacity: 0.4 }} />
              <div style={{ fontSize: 14, marginTop: 8 }}>No scores yet — be the first!</div>
            </div>
          ) : (
            <div>
              {current.map((s, idx) => {
                const medal = ['#d4a437', '#94a3b8', '#a16207'][idx];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx < current.length - 1 ? '1px solid #1a1a2e22' : 'none' }}>
                    <div className="bio-display" style={{ width: 30, fontWeight: 700, fontSize: 18, color: medal || '#1a1a2e', opacity: medal ? 1 : 0.5, textAlign: 'center' }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                    <div className="bio-display" style={{ fontWeight: 700, fontSize: 18 }}>{s.score}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, opacity: 0.4, marginTop: 16 }}>
          Scores shared with everyone using this puzzle
        </p>
      </div>
    </div>
  );
}

// ============ MAIN APP ============

export default function BioPuzzles() {
  const [view, setView] = useState('hub');
  const [scores, setScores] = useState({ binsort: [], connections: [], ordering: [] });
  const [loading, setLoading] = useState(false);
  
  const loadScores = async () => {
    setLoading(true);
    const out = { binsort: [], connections: [], ordering: [] };
    for (const key of ['binsort', 'connections', 'ordering']) {
      try {
        const r = await window.storage.get(`leaderboard:${key}`, true);
        if (r) out[key] = JSON.parse(r.value);
      } catch (e) {
        // key doesn't exist yet, leave as []
      }
    }
    setScores(out);
    setLoading(false);
  };
  
  useEffect(() => { loadScores(); }, []);
  
  const recordScore = async (gameKey, name, score) => {
    const existing = scores[gameKey] || [];
    const updated = [...existing, { name, score, date: Date.now() }].sort((a, b) => b.score - a.score).slice(0, 20);
    try {
      await window.storage.set(`leaderboard:${gameKey}`, JSON.stringify(updated), true);
      setScores({ ...scores, [gameKey]: updated });
    } catch (e) {
      console.error('Could not save score', e);
    }
  };
  
  return (
    <>
      <style>{STYLES}</style>
      <style>{`.bio-spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="bio-app bio-bg">
        <div className="bio-grain" />
        {view === 'hub' && <Hub onNav={setView} />}
        {view === 'binsort' && <BinSortGame onBack={() => { setView('hub'); loadScores(); }} onScore={recordScore} />}
        {view === 'connections' && <ConnectionsGame onBack={() => { setView('hub'); loadScores(); }} onScore={recordScore} />}
        {view === 'ordering' && <OrderingGame onBack={() => { setView('hub'); loadScores(); }} onScore={recordScore} />}
        {view === 'leaderboard' && <Leaderboard onBack={() => setView('hub')} scores={scores} loading={loading} />}
      </div>
    </>
  );
}