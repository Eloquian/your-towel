import React, { useState } from 'react';
import { assemblePortrait } from '../hooks/useApi';

const GROUPS = [
  {
    id: 'past',
    heading: 'Who you were',
    note: 'Think about your work before things got complicated. This isn't nostalgia. It's evidence.',
    questions: [
      { id: 'q1', text: 'What kind of work made you lose track of time? Not the job title. The actual work.' },
      { id: 'q2', text: 'What did the people who rated you most highly say about you? If you find that hard to remember, what would you want them to have said?' },
      { id: 'q3', text: "What's a piece of work you're genuinely proud of? What made it good?" },
    ],
  },
  {
    id: 'values',
    heading: "What you're made of",
    note: "These are about what matters to you, not what you're supposed to say matters to you.",
    questions: [
      { id: 'q4', text: "What's the thing at work you will not compromise on, even when it would be easier to?" },
      { id: 'q5', text: "What kind of environment brings out your best? Be specific: the type of people, the way decisions get made, what good leadership looks like to you." },
      { id: 'q6', text: "What do you want people to say about working with you, when you're not in the room?" },
    ],
  },
  {
    id: 'future',
    heading: "Where you're headed",
    note: "Not a five-year plan. Just a direction. Vague is fine. Point at something.",
    questions: [
      { id: 'q7', text: 'If the current situation resolved tomorrow and you could do anything professionally, what would you move towards?' },
      { id: 'q8', text: "What would you regret not having tried?" },
      { id: 'q9', text: "What does good actually look like for you, twelve months from now? Not perfect. Just good." },
    ],
  },
];

export default function Zone2({ onNext, onDataUpdate }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('questions'); // 'questions' | 'assembling' | 'portrait'
  const [portrait, setPortrait] = useState(null);
  const [error, setError] = useState(null);

  const currentGroup = GROUPS[groupIndex];

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    if (groupIndex < GROUPS.length - 1) {
      setGroupIndex(i => i + 1);
    } else {
      setPhase('assembling');
      try {
        const result = await assemblePortrait(answers);
        setPortrait(result);
        setPhase('portrait');
        onDataUpdate({ zone2Answers: answers, portrait: result });
      } catch (err) {
        setError('Something went wrong assembling your portrait. Please try again.');
        setPhase('questions');
      }
    }
  };

  const handleContinue = () => {
    onNext();
  };

  if (phase === 'assembling') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle">What you know about yourself</p>
          <div className="orange-rule" />
          <h2 className="zone-heading">Assembling your portrait.</h2>
          <p className="loading-state">Give us a moment.</p>
        </div>
      </div>
    );
  }

  if (phase === 'portrait' && portrait) {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">What you know about yourself</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">Your Portrait.</h2>

          <p className="body-copy fade-up fade-up-delay-3">
            That's your portrait. Not a plan, not a promise. A reminder of who you are and what you're pointed at. Keep it close. Everything that comes next builds from here.
          </p>

          <div className="portrait-grid fade-up fade-up-delay-4">
            {portrait.bestWork && (
              <div className="output-card">
                <p className="output-card-label">I do my best work when</p>
                <p className="output-card-content">{portrait.bestWork}</p>
              </div>
            )}
            {portrait.nonNegotiables && (
              <div className="output-card">
                <p className="output-card-label">What I won't compromise on</p>
                <p className="output-card-content">{portrait.nonNegotiables}</p>
              </div>
            )}
            {portrait.direction && (
              <div className="output-card">
                <p className="output-card-label">Where I'm headed</p>
                <p className="output-card-content">{portrait.direction}</p>
              </div>
            )}
            {portrait.untried && (
              <div className="output-card">
                <p className="output-card-label">What I don't want to leave untried</p>
                <p className="output-card-content">{portrait.untried}</p>
              </div>
            )}
          </div>

          <div className="fade-up fade-up-delay-5">
            <button className="btn-primary" onClick={handleContinue}>
              Continue
            </button>
          </div>
          <p className="easter-egg fade-up fade-up-delay-5">There you are.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">What you know about yourself</p>
        <div className="orange-rule fade-up fade-up-delay-2" />
        <h2 className="zone-heading fade-up fade-up-delay-3">Let's remember who you are.</h2>

        {groupIndex === 0 && (
          <p className="body-copy fade-up fade-up-delay-3">
            Not who HCL thinks you are. Not who you've had to be to get through the last few months. Who you actually are: the professional that Symplicit saw, that your colleagues relied on, that did genuinely good work.
            <br /><br />
            That person is still here. They just haven't had much of a mirror lately.
            <br /><br />
            These questions aren't about the situation. They're about you. Take your time.
          </p>
        )}

        <div className="fade-up fade-up-delay-3">
          <p className="group-heading">{currentGroup.heading}</p>
          <p className="group-italic">{currentGroup.note}</p>

          {currentGroup.questions.map((q, i) => (
            <div key={q.id} className="question-block">
              <p className="question-number">{(groupIndex * 3) + i + 1}</p>
              <p className="question-text">{q.text}</p>
              <textarea
                className="question-input"
                rows={3}
                placeholder="Take your time."
                value={answers[q.id] || ''}
                onChange={e => handleAnswer(q.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {error && <p style={{ color: 'var(--orange)', marginTop: '16px', fontSize: '13px' }}>{error}</p>}

        <div className="fade-up fade-up-delay-4">
          <button className="btn-primary" onClick={handleNext}>
            {groupIndex < GROUPS.length - 1 ? 'Next' : 'Build my portrait'}
          </button>
        </div>
      </div>
    </div>
  );
}
