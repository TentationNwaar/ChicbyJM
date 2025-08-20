// src/components/StarRating.tsx
import React from "react";

export function StarDisplay({ value, size=18 }: { value: number|null, size?: number }) {
  const v = value ?? 0;
  return (
    <div aria-label={`Note ${v}/5`} style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(v) ? "currentColor" : "none"} stroke="currentColor">
          <path d="M12 17.3l-6.16 3.64 1.64-7.03L2 8.77l7.19-.62L12 1.5l2.81 6.65 7.19.62-5.48 5.14 1.64 7.03z"/>
        </svg>
      ))}
    </div>
  );
}

export function StarInput({ value, onChange }:{ value:number, onChange:(v:number)=>void }) {
  return (
    <div style={{ display:"inline-flex", gap:6, cursor:"pointer" }} aria-label={`Sélection : ${value} sur 5`}>
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} étoile${i>1?'s':''}`}
          style={{ all: 'unset', lineHeight: 0, cursor: 'pointer' }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill={i <= value ? "currentColor" : "none"} stroke="currentColor">
            <path d="M12 17.3l-6.16 3.64 1.64-7.03L2 8.77l7.19-.62L12 1.5l2.81 6.65 7.19.62-5.48 5.14 1.64 7.03z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}