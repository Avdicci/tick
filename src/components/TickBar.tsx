import React from 'react';

type TickBarProps = {
  count: number;
};

export const TickBar: React.FC<TickBarProps> = ({ count }) => {
  if (count <= 0) {
    return <div className="tick-bar tick-bar--empty" />;
  }

  // Clamp between 1 and 200 for sanity so CSS doesn't get absurdly small.
  const clampedCount = Math.max(1, Math.min(count, 200));

  const ticks = Array.from({ length: clampedCount }, (_, i) => i);

  const barStyle: React.CSSProperties = {
    // Used by CSS to compute width: 100% / var(--tick-count)
    // Keeps everything flex-based and responsive to container size.
    ['--tick-count' as string]: clampedCount
  };

  return (
    <div className="tick-bar" style={barStyle}>
      {ticks.map((i) => (
        <div key={i} className="tick-bar__tick" />
      ))}
    </div>
  );
};


