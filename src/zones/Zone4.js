import React, { useState } from 'react';

export default function Zone4({ onNext, onDataUpdate, zone3Answers }) {
  const [phase, setPhase] = useState('bridge'); // 'bridge' | 'select' | 'questions' | 'reveal'
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Extract named options from zone 3 answers for selection
  const candidateOptions = [
    zone3Answers?.q1,
    zone3Answers?.q2,
    zone3Answers?.q3,
    zone3Answers?.q4,
    zone3Answers?.q6,
    zone3Answers?.q7,
    zone3Answers?.q8,
    zone3Answers?.q9,
    zone3Answers?.q12,
  ].filter(Boolean).filter(v => v.trim().length > 5);

  const toggleOption = (opt) => {
    setSelectedOptions(prev => {
      if (prev.includes(opt)) return prev.filter(o => o !== opt);
      if (prev.length >= 3) return prev;
      return [...prev, opt];
    });
  };

  const handleAnswer = (optIndex, qKey, value) => {
    setAnswers(prev => ({ ...prev, [`${optIndex}_${qKey}`]: value }));
  };

  const handleNextOption = () => {
    if (currentOptionIndex < selectedOptions.length - 1) {
      setCurrentOptionIndex(i => i + 1);
    } else {
      setPhase('reveal');
      onDataUpdate({ zone4Answers: answers, selectedOptions });
    }
  };

  const labels = ['A', 'B', 'C'];
  const currentOption = selectedOptions[currentOptionIndex];

  if (phase === 'bridge') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">Making the options real</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">Let's look at three of these properly.</h2>
          <p className="body-copy fade-up fade-up-delay-3">
            You've done the expansive thinking. That part is finished.
          </p>
          <p className="body-copy fade-up fade-up-delay-4">
            This is different. It's quieter, more practical. You're not generating anything new. You're just taking three of the options you've already named and thinking them through carefully enough that they feel solid. Prepared. Ready to pick up when you need them.
          </p>
          <p className="body-copy fade-up fade-up-delay-4">
            You don't have to commit to any of them. You're building positions, not making decisions.
          </p>
          <div className="fade-up fade-up-delay-5">
            <button className="btn-primary" onClick={() => setPhase('select')}>
              Choose my three
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'select') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">Making the options real</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3" style={{ fontSize: '32px' }}>
            Choose three options to look at properly.
          </h2>
          <p className="body-copy fade-up fade-up-delay-3">
            They don't have to be the most realistic ones. Choose the three that feel most worth understanding properly.
          </p>
          <p className="instruction fade-up fade-up-delay-3">
            {selectedOptions.length} of 3 selected
          </p>
          <div className="options-list fade-up fade-up-delay-4">
            {candidateOptions.length > 0 ? candidateOptions.map((opt, i) => (
              <button
                key={i}
                className={`option-item${selectedOptions.includes(opt) ? ' selected' : ''}`}
                onClick={() => toggleOption(opt)}
                disabled={selectedOptions.length >= 3 && !selectedOptions.includes(opt)}
              >
                {opt}
              </button>
            )) : (
              <p className="body-copy" style={{ opacity: 0.5 }}>
                Complete Zone 3 first to populate options here.
              </p>
            )}
          </div>
          <div className="fade-up fade-up-delay-5">
            <button
              className="btn-primary"
              onClick={() => { setCurrentOptionIndex(0); setPhase('questions'); }}
              disabled={selectedOptions.length < 1}
            >
              Good. Let's look at each one.
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'questions') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">
            Option {labels[currentOptionIndex]} of {labels[selectedOptions.length - 1]}
          </p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3" style={{ fontSize: '28px' }}>
            Option {labels[currentOptionIndex]}: {currentOption}
          </h2>

          <div className="fade-up fade-up-delay-3">
            <div className="question-block">
              <p className="question-number">1</p>
              <p className="question-text">
                What would this path actually ask of you? Think about time, energy, money, relationships, and nerve. What's the real cost of it?
              </p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="Be honest about what it would actually take."
                value={answers[`${currentOptionIndex}_cost`] || ''}
                onChange={e => handleAnswer(currentOptionIndex, 'cost', e.target.value)}
              />
            </div>

            <div className="question-block">
              <p className="question-number">2</p>
              <p className="question-text">
                If you decided to take this path, what's the first thing you'd actually do? Not the whole plan. Just the first move.
              </p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="One action, however small."
                value={answers[`${currentOptionIndex}_first`] || ''}
                onChange={e => handleAnswer(currentOptionIndex, 'first', e.target.value)}
              />
            </div>

            <div className="question-block">
              <p className="question-number">3</p>
              <p className="question-text">
                What would need to be true, or in place, for this to be possible? What are you waiting on, if anything?
              </p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="Dependencies, not obstacles."
                value={answers[`${currentOptionIndex}_needs`] || ''}
                onChange={e => handleAnswer(currentOptionIndex, 'needs', e.target.value)}
              />
            </div>
          </div>

          <div className="fade-up fade-up-delay-4">
            <button className="btn-primary" onClick={handleNextOption}>
              {currentOptionIndex < selectedOptions.length - 1 ? `Next: Option ${labels[currentOptionIndex + 1]}` : 'See my prepared positions'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reveal
  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">Making the options real</p>
        <div className="orange-rule fade-up fade-up-delay-2" />
        <h2 className="zone-heading fade-up fade-up-delay-3">Three prepared positions.</h2>

        <div className="fade-up fade-up-delay-3">
          {selectedOptions.map((opt, i) => (
            <div key={i} className="output-card" style={{ marginTop: i === 0 ? '32px' : '12px' }}>
              <p className="output-card-label">Option {labels[i]}</p>
              <p className="output-card-content" style={{ fontWeight: 500, marginBottom: '12px', color: 'var(--white)' }}>{opt}</p>
              {answers[`${i}_cost`] && <p className="output-card-content" style={{ fontSize: '13px', marginBottom: '6px' }}><span style={{ color: 'var(--orange)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Costs </span>{answers[`${i}_cost`]}</p>}
              {answers[`${i}_first`] && <p className="output-card-content" style={{ fontSize: '13px', marginBottom: '6px' }}><span style={{ color: 'var(--orange)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>First move </span>{answers[`${i}_first`]}</p>}
              {answers[`${i}_needs`] && <p className="output-card-content" style={{ fontSize: '13px' }}><span style={{ color: 'var(--orange)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Needs </span>{answers[`${i}_needs`]}</p>}
            </div>
          ))}
        </div>

        <div className="transition-text fade-up fade-up-delay-4">
          None of them are promises. All of them are real. When the moment comes to move, you'll know what each one actually involves and what it needs from you. That's not a small thing. One more step after this, and it's the shortest one.
        </div>

        <div className="fade-up fade-up-delay-5">
          <button className="btn-primary" onClick={onNext}>Continue</button>
        </div>
        <p className="easter-egg fade-up fade-up-delay-5">So long, and thanks for all the options.</p>
      </div>
    </div>
  );
}
