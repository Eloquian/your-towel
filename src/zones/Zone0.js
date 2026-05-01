import React from 'react';

export default function Zone0({ onNext }) {
  return (
    <div className="screen">
      <div className="screen-inner">
        <p className="supertitle fade-up fade-up-delay-1">A thinking tool for uncertain times</p>
        <div className="orange-rule fade-up fade-up-delay-2" />
        <h1 className="wordmark fade-up fade-up-delay-3">Don't Panic.</h1>
        <p className="body-copy fade-up fade-up-delay-4">
          Good advice. The best advice, arguably. It worked for Arthur Dent, and he lost his house and the entire planet in a single Thursday morning.
        </p>
        <p className="body-copy fade-up fade-up-delay-4">
          Something has shifted at work. You're not sure yet whether it's a blip or the beginning of something bigger.
        </p>
        <p className="body-copy fade-up fade-up-delay-4">
          This tool won't tell you what to do. It will help you think clearly about where you are, what matters to you, and what your options actually look like. It goes at your pace. Nothing you write here is collected, stored, or seen by anyone but you.
        </p>
        <p className="body-copy fade-up fade-up-delay-5">
          Find somewhere quiet. You don't need to be brave. Just honest with yourself. You're already halfway there.
        </p>
        <div className="fade-up fade-up-delay-5">
          <button className="btn-primary" onClick={onNext}>
            Right then. Let's go.
          </button>
        </div>
        <p className="easter-egg fade-up fade-up-delay-5">You hoopy frood.</p>
      </div>
    </div>
  );
}
