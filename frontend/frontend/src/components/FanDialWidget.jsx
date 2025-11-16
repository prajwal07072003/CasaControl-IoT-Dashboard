import React, { useMemo, useState } from "react";
import api from "../lib/api";

const SIZE = 120;               // SVG size
const STROKE = 10;
const R = (SIZE - STROKE) / 2;  // radius
const CIRC = 2 * Math.PI * R;

export default function FanDialWidget({ device, initial = 3 }) {
  const [speed, setSpeed] = useState(initial); // 0–5
  const pct = useMemo(() => (speed / 5) * 100, [speed]);
  const dash = useMemo(() => (CIRC * pct) / 100, [pct]);

  const update = async (n) => {
    const v = Math.max(0, Math.min(5, n));
    setSpeed(v);
    if (device?.id) {
      try { await api.post(`/devices/${device.id}/speed?level=${v}`); } catch {}
    }
  };

  return (
    <div className="widget card fan-dial">
      <div className="widget-head">
        <div className="widget-title">Fan</div>
        <div className={`pill ${speed>0?"on":""}`}>{speed === 0 ? "Off" : `Speed ${speed}`}</div>
      </div>

      <div className="dial-wrap">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={SIZE/2} cy={SIZE/2} r={R}
            stroke="rgba(255,255,255,0.12)" strokeWidth={STROKE}
            fill="none"
          />
          <circle
            className="dial-bar"
            cx={SIZE/2} cy={SIZE/2} r={R}
            stroke="currentColor" strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="dial-text">
            {speed}
          </text>
        </svg>
      </div>

      <div className="dial-actions">
        {[0,1,2,3,4,5].map(n => (
          <button
            key={n}
            className={`chip ${speed===n?"active":""}`}
            onClick={() => update(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
