import React, { useState } from 'react';
import './styles.css';
import Background from './components/Background';
import Zone0 from './zones/Zone0';
import Zone1 from './zones/Zone1';
import Zone2 from './zones/Zone2';
import Zone3 from './zones/Zone3';
import Zone4 from './zones/Zone4';
import Zone5 from './zones/Zone5';

const ZONES = ['Ground', 'Empathise', 'Define', 'Ideate', 'Prototype', 'Test'];

export default function App() {
  const [zone, setZone] = useState(0);
  const [appData, setAppData] = useState({});

  const updateData = (newData) => {
    setAppData(prev => ({ ...prev, ...newData }));
  };

  const next = () => setZone(z => Math.min(z + 1, 5));

  const progress = (zone / 5) * 100;

  return (
    <div>
      <Background />
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      {zone > 0 && (
        <div className="zone-label">
          Zone {zone} — {ZONES[zone]}
        </div>
      )}

      {zone === 0 && <Zone0 onNext={next} />}
      {zone === 1 && <Zone1 onNext={next} onDataUpdate={updateData} />}
      {zone === 2 && <Zone2 onNext={next} onDataUpdate={updateData} />}
      {zone === 3 && (
        <Zone3
          onNext={next}
          onDataUpdate={updateData}
          portrait={appData.portrait}
        />
      )}
      {zone === 4 && (
        <Zone4
          onNext={next}
          onDataUpdate={updateData}
          zone3Answers={appData.zone3Answers}
        />
      )}
      {zone === 5 && (
        <Zone5
          onDataUpdate={updateData}
          selectedOptions={appData.selectedOptions}
        />
      )}
    </div>
  );
}
