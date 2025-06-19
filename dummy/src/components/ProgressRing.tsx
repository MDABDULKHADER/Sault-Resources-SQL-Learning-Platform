
import React from 'react';

interface ProgressRingProps {
  progress: number;
  radius: number;
  stroke: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, radius, stroke }) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        className="stroke-muted"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className="progress-ring-circle stroke-primary"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="fill-foreground text-xs font-medium"
      >
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  );
};

export default ProgressRing;
