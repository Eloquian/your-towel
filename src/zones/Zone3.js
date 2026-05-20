import React, { useState } from 'react';
import { assembleOptionsMap } from '../hooks/useApi';

function getFraming(portrait) {
  if (!portrait) return 'Holding your non-negotiables close, what options are available to you right now?';
  const text = portrait.nonNegotiables || '';
  if (text.toLowerCase().includes('creat') || text.toLowerCase().includes('autonomy')) {
    return `You said you won't compromise on creative control. Holding that, what moves are available to you right now, inside or outside HCL?`;
  }
  if (text.toLowerCase().includes('financ') || text.toLowerCase().includes('security') || text.toLowerCase().includes('stabil')) {
    return `You said financial security is non-negotiable. Holding that, what options are actually on the table right now?`;
  }
  if (text.toLowerCase().includes('value') || text.toLowerCase().includes('right') || text.toLowerCase().includes('ethic') || text.toLowerCase().includes('integr')) {
    return `You said you won't compromise on what's right. From that position, what could you do right now that would feel consistent with that?`;
  }
  return `Holding your non-negotiables close, what options are available to you right now?`;
}

function getDirectionFraming(portrait) {
  if (!portrait || !portrait.direction) return "What options, near or far, move you in that direction?";
  return `You said: "${portrait.direction}" What options, near or far, move you in that direction?`;
}

function getUntriedFraming(portrait) {
  if (!portrait || !portrait.untried) return "This is the space to think about that properly.";
  return `You said you don't want to leave untried: "${portrait.untried}" This is the space to think about that properly.`;
}

const GROUPS = (portrait) => [
  {
    id: 'now',
    heading: 'What you could do right now',
    framing: getFraming(portrait),
    questions: [
      { id: 'q1', text: "What's the most obvious move? The one you've thought of a hundred times already. Put it down." },
      { id: 'q2', text: "What's the option you keep dismissing before you've properly thought it through?" },
      { id: 'q3', text: "What would you do if you had six months of runway and no immediate pressure?" },
    ],
  },
  {
    id: 'towards',
    heading: 'What you could build towards',
    framing: getDirectionFraming(portrait),
    questions: [
      { id: 'q4', text: "What's one step, however small, that moves you closer to what you described?" },
      { id: 'q5', text: "What would you need to make that direction more possible? A skill, a connection, a decision, time." },
      { id: 'q6', text: "What's the version of this that feels slightly too ambitious? Put it down anyway." },
    ],
  },
  {
    id: 'unthought',
    heading: "What you haven't let yourself think about",
    framing: getUntriedFraming(portrait),
    questions: [
      { id: 'q7', text: "If you knew it would work out, what would you do?" },
      { id: 'q8', text: "What's the option that would require the most courage? Just name it. You don't have to do it." },
      { id: 'q9', text: "What's the thing you've quietly wanted to try but kept finding reasons not to?" },
    ],
  },
  {
    id: 'hcl',
    heading: 'What you could do with HCL specifically',
    framing: 'HCL is where you are right now, not where you\'re going. But there may be things worth extracting from it before you move on, and things worth doing inside it that serve your Portrait.',
    questions: [
      { id: 'q10', text: "What could you get from HCL that would make your next move easier? Skills, experience, references, financial runway." },
      { id: 'q11', text: "Is there anything worth trying to change or influence from inside, and do you have the energy for it right now?" },
      { id: 'q12', text: "What would staying look like if it were entirely on your terms? Is that achievable?" },
    ],
  },
];

export default function Zone3({ onNext, onDataUpdate, portrait, miro, optionsMap: existingOptionsMap }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'questions' | 'assembling' | 'map'
  const [groupIndex, setGroupIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [optionsMap, setOptionsMap] = useState(null);
  const [error, setError] = useState(null);

  const groups = GROUPS(portrait);
  const currentGroup = groups[groupIndex];

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    if (groupIndex < groups.length - 1) {
      setGroupIndex(i => i + 1);
    } else {
      setPhase('assembling');
      try {
        const result = await assembleOptionsMap(answers, portrait);
        setOptionsMap(result);
        setPhase('map');
        onDataUpdate({ zone3Answers: answers, optionsMap: result });
        if (miro.boardId) {
          miro.exportOptionsMap(miro.boardId, result);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        setPhase('questions');
      }
    }
  };

  if (phase === 'intro') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">All of it. Every option.</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">What could you do?</h2>
          <p className="body-copy fade-up fade-up-delay-3">
            Not what you should do. Not what's realistic. Not what people would think. All of it.
          </p>
          <p className="body-copy fade-up fade-up-delay-4">
            This is the one part of the process where the rules are suspended. Nothing here is a commitment. You're just thinking, and thinking out loud is exactly where good options come from.
          </p>
          <p className="body-copy fade-up fade-up-delay-4">
            Your Portrait is open beside you. Let it do some of the work.
          </p>
          <p className="instruction fade-up fade-up-delay-4">
            We're going to move through four lenses. For each one, say everything that comes up: the obvious things and the unlikely ones, the safe bets and the ones that feel a bit much. Especially those.
          </p>
          <div className="fade-up fade-up-delay-5">
            <button className="btn-primary" onClick={() => setPhase('questions')}>
              Let's think
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'assembling') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle">All of it. Every option.</p>
          <div className="orange-rule" />
          <h2 className="zone-heading">Mapping your options.</h2>
          <p className="loading-state">Nearly there.</p>
        </div>
      </div>
    );
  }

  if (phase === 'map' && optionsMap) {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">All of it. Every option.</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">Your options map.</h2>

          <div className="fade-up fade-up-delay-3">
            <div className="output-card">
              <p className="output-card-label">The full picture</p>
              <p className="output-card-content">{optionsMap.summary}</p>
            </div>
            {optionsMap.mostInteresting && (
              <div className="output-card" style={{ borderColor: 'rgba(252,84,0,0.3)' }}>
                <p className="output-card-label">Worth noting</p>
                <p className="output-card-content">{optionsMap.mostInteresting}</p>
              </div>
            )}
          </div>

          <div className="transition-text fade-up fade-up-delay-4">
            That's your full options map. Some of these will go nowhere. That's fine. A few are probably more possible than they felt when you wrote them down.
            <br /><br />
            You've thought about all of it. That matters. Now let's look at three of them properly.
          </div>

          <div className="fade-up fade-up-delay-5">
            <button className="btn-primary" onClick={onNext}>
              Continue
            </button>
          </div>
          <p className="easter-egg fade-up fade-up-delay-5">Forty-two probably isn't on the list. But something useful is.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">
          {groupIndex + 1} of {groups.length}
        </p>
        <div className="orange-rule fade-up fade-up-delay-2" />

        <div className="fade-up fade-up-delay-3">
          <p className="group-heading">{currentGroup.heading}</p>
          <p className="framing-text">{currentGroup.framing}</p>

          {currentGroup.questions.map((q, i) => (
            <div key={q.id} className="question-block">
              <p className="question-number">{(groupIndex * 3) + i + 1}</p>
              <p className="question-text">{q.text}</p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="Everything. The obvious and the unlikely."
                value={answers[q.id] || ''}
                onChange={e => handleAnswer(q.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {error && <p style={{ color: 'var(--orange)', marginTop: '16px', fontSize: '13px' }}>{error}</p>}

        <div className="fade-up fade-up-delay-4">
          <button className="btn-primary" onClick={handleNext}>
            {groupIndex < groups.length - 1 ? 'Next lens' : 'Show me my options map'}
          </button>
        </div>
      </div>
    </div>
  );
}
