import React, { useState } from 'react';

const STATES = [
  {
    id: 'scared',
    label: "I'm scared about what comes next",
    questions: [
      "What specifically are you most afraid of? Name it plainly, even if it sounds dramatic written down.",
      "Of the things you're afraid of, which ones are actually happening right now, and which ones are possibilities you're carrying?",
      "What would it mean for you if the worst didn't happen?",
    ],
  },
  {
    id: 'angry',
    label: "I'm angry and I need somewhere to put it",
    questions: [
      "What happened, or is happening, that feels most wrong to you? Not the whole situation. The specific thing.",
      "Underneath the anger, what is it that you actually care about that's being threatened?",
      "If you could channel that energy into one purposeful action, what would it be?",
    ],
  },
  {
    id: 'exhausted',
    label: "I'm exhausted and I can't think straight",
    questions: [
      "How long have you been carrying this? Give it a rough shape: weeks, months, longer.",
      "What's taking the most out of you right now? The situation itself, the uncertainty, or keeping up appearances?",
      "If you could put one thing down, just temporarily, what would it be?",
    ],
  },
  {
    id: 'numb',
    label: "I've gone a bit numb, honestly",
    questions: [
      "When did you notice the numbness arrive? Was there a specific moment, or did it creep in?",
      "What do you think it's protecting you from?",
      "If the numbness lifted just enough to let one feeling through, what do you think it would be?",
    ],
  },
  {
    id: 'holding',
    label: "I'm holding it together but only just",
    questions: [
      "What does 'holding it together' cost you on a typical day?",
      "Who, if anyone, knows how close to the edge you actually are?",
      "What would it feel like to not have to hold it together, even for an hour?",
    ],
  },
];

export default function Zone1({ onNext, onDataUpdate }) {
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('select'); // 'select' | 'questions'
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const toggleState = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    setPhase('questions');
    setCurrentStateIndex(0);
  };

  const handleAnswer = (stateId, qIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${stateId}_${qIndex}`]: value,
    }));
  };

  const handleNextState = () => {
    if (currentStateIndex < selected.length - 1) {
      setCurrentStateIndex(i => i + 1);
    } else {
      onDataUpdate({ zone1States: selected, zone1Answers: answers });
      onNext();
    }
  };

  const activeStates = STATES.filter(s => selected.includes(s.id));
  const currentState = activeStates[currentStateIndex];

  if (phase === 'select') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">What's actually happening with you</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">How are you feeling right now?</h2>
          <p className="instruction fade-up fade-up-delay-3">Pick what fits. More than one is fine.</p>
          <div className="state-cards fade-up fade-up-delay-4">
            {STATES.map(s => (
              <button
                key={s.id}
                className={`state-card${selected.includes(s.id) ? ' selected' : ''}`}
                onClick={() => toggleState(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="fade-up fade-up-delay-5">
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={selected.length === 0}
            >
              That's where I am
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">
          {currentStateIndex + 1} of {activeStates.length}
        </p>
        <div className="orange-rule fade-up fade-up-delay-2" />
        <h2 className="zone-heading fade-up fade-up-delay-3" style={{ fontSize: '28px' }}>
          {currentState.label}
        </h2>
        <div className="fade-up fade-up-delay-3">
          {currentState.questions.map((q, i) => (
            <div key={i} className="question-block">
              <p className="question-number">{i + 1}</p>
              <p className="question-text">{q}</p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="Take your time."
                value={answers[`${currentState.id}_${i}`] || ''}
                onChange={e => handleAnswer(currentState.id, i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="fade-up fade-up-delay-4">
          <button className="btn-primary" onClick={handleNextState}>
            {currentStateIndex < activeStates.length - 1 ? 'Next' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
