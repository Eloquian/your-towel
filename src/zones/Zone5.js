import React, { useState } from 'react';

export default function Zone5({ onDataUpdate, selectedOptions, miro, appData }) {
  const [phase, setPhase] = useState('questions'); // 'questions' | 'brief'
  const [move, setMove] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [why, setWhy] = useState('');

  const handleComplete = async () => {
    const brief = { move, timeframe, why };
    onDataUpdate({ zone5Brief: brief });
    if (miro.boardId) {
      await miro.exportActionBrief(miro.boardId, brief);
    }
    setPhase('brief');
  };

  if (phase === 'brief') {
    return (
      <div className="screen">
        <div className="screen-inner">
          <p className="supertitle fade-up fade-up-delay-1">One move. That's all.</p>
          <div className="orange-rule fade-up fade-up-delay-2" />
          <h2 className="zone-heading fade-up fade-up-delay-3">Your action brief.</h2>

          <div className="fade-up fade-up-delay-3">
            <div className="output-card">
              <p className="output-card-label">My first move</p>
              <p className="output-card-content">{move}</p>
            </div>
            <div className="output-card" style={{ marginTop: '2px' }}>
              <p className="output-card-label">By</p>
              <p className="output-card-content">{timeframe}</p>
            </div>
            <div className="output-card" style={{ marginTop: '2px', borderColor: 'rgba(255,205,65,0.25)', background: 'rgba(255,205,65,0.03)' }}>
              <p className="output-card-label" style={{ color: 'var(--yellow)' }}>Because</p>
              <p className="output-card-content">{why}</p>
            </div>
          </div>

          <div className="transition-text fade-up fade-up-delay-4">
            That's it. That's the whole thing.
            <br /><br />
            Your first move doesn't have to be a work move. It might be rest, or time with people who restore you, or simply deciding that this week you're not going to think about any of it. Those are real actions. They count. A person who is looked after is a person who can act when the moment calls for it.
            <br /><br />
            Nothing you wrote here was collected, stored, or seen by anyone but you. It never left your hands.
          </div>

          <div className="fade-up fade-up-delay-5">
            {miro.boardId ? (
              <button className="btn-primary" onClick={() => window.open(`https://miro.com/app/board/${miro.boardId}/`, '_blank')}>
                Open my Miro canvas
              </button>
            ) : (
              <button className="btn-primary" onClick={() => window.scrollTo(0, 0)}>
                Back to top
              </button>
            )}
          </div>
          <p className="easter-egg fade-up fade-up-delay-5">Don't forget your towel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">One move. That's all.</p>
        <div className="orange-rule fade-up fade-up-delay-2" />
        <h2 className="zone-heading fade-up fade-up-delay-3">What are you going to do first?</h2>

        <p className="body-copy fade-up fade-up-delay-3">
          You've done the hard work. This is the last part, and it's the shortest.
        </p>
        <p className="body-copy fade-up fade-up-delay-3">
          This isn't about having everything figured out. It's about leaving here with one clear move: something concrete, something yours, something you've actually decided rather than just considered.
        </p>

        <div className="fade-up fade-up-delay-4">
          <div className="question-block">
            <p className="question-number">1</p>
            <p className="question-text">
              Looking at your three prepared positions, what's your first move? It doesn't have to come from your favourite option, and it doesn't have to be a work move. Rest, recovery, or time away from all of this is a legitimate first move. It just has to be real and doable.
            </p>
            <textarea
              className="question-input"
              rows={3}
              placeholder="Something real. Something doable."
              value={move}
              onChange={e => setMove(e.target.value)}
            />
          </div>

          <div className="question-block">
            <p className="question-number">2</p>
            <p className="question-text">
              When will you do it? Give it a shape: a day, a week, a month. Vague is fine. Just point at something.
            </p>
            <textarea
              className="question-input"
              rows={2}
              placeholder="A day, a week, a month."
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
            />
          </div>

          <div className="question-block">
            <p className="question-number">3</p>
            <p className="question-text">
              In one sentence: why this move, now? Not a justification. Just the truth of it, in your own words.
            </p>
            <textarea
              className="question-input"
              rows={2}
              placeholder="The truth of it."
              value={why}
              onChange={e => setWhy(e.target.value)}
            />
          </div>
        </div>

        <div className="fade-up fade-up-delay-5">
          <button
            className="btn-primary"
            onClick={handleComplete}
            disabled={!move.trim() || !timeframe.trim() || !why.trim()}
          >
            Complete my brief
          </button>
        </div>
      </div>
    </div>
  );
}
