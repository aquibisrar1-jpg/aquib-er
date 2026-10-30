// Original mascots, hand-drawn in SVG. No borrowed characters.

export function Raccoon({ size = 120, className = "", mood = "smug" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-label="The AI Overview raccoon" role="img">
      {/* tail */}
      <g transform="rotate(-25 95 92)">
        <ellipse cx="100" cy="92" rx="10" ry="22" fill="#6b6b6b" stroke="#111" strokeWidth="3" />
        <path d="M92 80 h16 M91 92 h18 M93 104 h14" stroke="#111" strokeWidth="5" />
      </g>
      {/* body */}
      <ellipse cx="60" cy="92" rx="30" ry="22" fill="#8a8a8a" stroke="#111" strokeWidth="3" />
      {/* stolen click (mouse cursor) */}
      <g transform="translate(70 80) rotate(-15)">
        <path d="M0 0 L0 22 L6 16 L11 26 L15 24 L10 14 L18 14 Z" fill="#fff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* ears */}
      <path d="M28 30 L22 8 L44 22 Z" fill="#6b6b6b" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      <path d="M92 30 L98 8 L76 22 Z" fill="#6b6b6b" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
      {/* head */}
      <ellipse cx="60" cy="46" rx="38" ry="30" fill="#a3a3a3" stroke="#111" strokeWidth="3" />
      {/* mask */}
      <path d="M24 44 Q40 30 60 42 Q80 30 96 44 Q86 58 72 52 Q60 48 48 52 Q34 58 24 44 Z" fill="#111" />
      {/* eyes */}
      <circle cx="44" cy="46" r="6" fill="#fff" />
      <circle cx="76" cy="46" r="6" fill="#fff" />
      <circle cx={mood === "caught" ? 44 : 46} cy="47" r="2.8" fill="#111" />
      <circle cx={mood === "caught" ? 76 : 78} cy="47" r="2.8" fill="#111" />
      {/* snout */}
      <ellipse cx="60" cy="62" rx="12" ry="9" fill="#e9e9e9" stroke="#111" strokeWidth="2.5" />
      <ellipse cx="60" cy="58" rx="4" ry="3" fill="#111" />
      {mood === "caught" ? (
        <ellipse cx="60" cy="67" rx="3" ry="3.5" fill="#111" />
      ) : (
        <path d="M53 66 Q60 71 67 65" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* AI badge */}
      <g transform="translate(36 98)">
        <rect x="0" y="-9" width="22" height="13" rx="3" fill="#ffe500" stroke="#111" strokeWidth="2" />
        <text x="11" y="1" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="monospace" fill="#111">AI</text>
      </g>
    </svg>
  );
}

export function StormCloud({ size = 160, className = "", angry = true }) {
  return (
    <svg className={className} width={size} height={size * 0.8} viewBox="0 0 160 128" aria-label="The Core Update" role="img">
      <path d="M78 92 L64 120 L80 112 L72 128" fill="none" stroke="#ffe500" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M78 92 L64 120 L80 112 L72 128" fill="none" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M34 92 Q10 92 12 72 Q14 54 34 56 Q34 30 60 28 Q76 8 100 22 Q124 16 130 42 Q152 46 148 68 Q146 92 120 92 Z"
        fill="#3b3b4f" stroke="#111" strokeWidth="3.5" strokeLinejoin="round"
      />
      {angry ? (
        <>
          <path d="M56 52 L72 58" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M104 52 L88 58" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="66" cy="66" r="5" fill="#fff" />
          <circle cx="94" cy="66" r="5" fill="#fff" />
          <path d="M68 82 Q80 74 92 82" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M60 64 Q66 60 72 64" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M88 64 Q94 60 100 64" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 78 Q80 84 90 78" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <text x="80" y="44" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="monospace" fill="#ffe500">CORE UPDATE</text>
    </svg>
  );
}
