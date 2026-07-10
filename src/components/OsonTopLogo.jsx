// ─────────────────────────────────────────────────────
// OsonTop Logo — SVG Component
// Rasmdan qayta yaratilgan: yashil sumka, odam+bola,
// sariq narx tagi, tezlik chiziqlari
// ─────────────────────────────────────────────────────

export function OsonTopIcon({ size = 36, dark = false }) {
  // Faqat icon qismi (sumka+odam+tag)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* Tezlik chiziqlari */}
      <line x1="2"  y1="34" x2="14" y2="34" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="4"  y1="42" x2="13" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.65"/>
      <line x1="6"  y1="50" x2="14" y2="50" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.45"/>

      {/* Sumka tutqichi */}
      <path
        d="M28 28 C28 18 52 18 52 28"
        stroke="#15803D"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sumka tanasi */}
      <rect x="14" y="26" width="52" height="44" rx="11" fill="url(#g1)" />

      {/* Ichki koʻk-yashil ajratuvchi chizig'i */}
      <path
        d="M14 52 Q40 66 66 44"
        fill="#15803D"
        opacity="0.25"
      />

      {/* Katta odam — bosh */}
      <circle cx="35" cy="43" r="7" fill="white" opacity="0.95"/>
      {/* Katta odam — tana */}
      <path d="M22 70 C22 57 48 57 48 70" fill="white" opacity="0.95"/>

      {/* Kichik odam (bola) — bosh */}
      <circle cx="50" cy="47" r="5" fill="white" opacity="0.8"/>
      {/* Kichik odam — tana */}
      <path d="M41 70 C41 60 59 60 59 70" fill="white" opacity="0.8"/>

      {/* Narx tagi (sariq) — o'ng yuqori */}
      <g transform="translate(50, 22) rotate(-20)">
        <rect width="20" height="15" rx="4" fill="#F59E0B"/>
        <circle cx="5" cy="5" r="2.2" fill="white"/>
        <line x1="8"  y1="9"  x2="17" y2="9"  stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="8"  y1="12.5" x2="15" y2="12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export function OsonTopLogoHorizontal({ width = 140, dark = false }) {
  // Gorizontal: icon + "Oson" + "Top"
  const textColor = dark ? "#ffffff" : "#1a2332";
  return (
    <svg
      width={width}
      height={width * 0.35}
      viewBox="0 0 200 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gh1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>

      {/* Icon qismi */}
      {/* Tezlik chiziqlari */}
      <line x1="2"  y1="28" x2="12" y2="28" stroke={dark?"white":"#16A34A"} strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      <line x1="4"  y1="35" x2="11" y2="35" stroke={dark?"white":"#16A34A"} strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>
      <line x1="5"  y1="42" x2="12" y2="42" stroke={dark?"white":"#16A34A"} strokeWidth="1.8" strokeLinecap="round" opacity="0.45"/>

      {/* Tutqi */}
      <path d="M23 22 C23 14 43 14 43 22" stroke="#15803D" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Sumka */}
      <rect x="12" y="20" width="42" height="36" rx="9" fill="url(#gh1)"/>
      {/* Katta odam bosh */}
      <circle cx="28" cy="34" r="5.5" fill="white" opacity="0.95"/>
      {/* Tana */}
      <path d="M18 56 C18 46 38 46 38 56" fill="white" opacity="0.95"/>
      {/* Kichik odam bosh */}
      <circle cx="40" cy="37" r="4" fill="white" opacity="0.8"/>
      <path d="M33 56 C33 48 47 48 47 56" fill="white" opacity="0.8"/>
      {/* Tag */}
      <g transform="translate(42, 16) rotate(-18)">
        <rect width="16" height="12" rx="3" fill="#F59E0B"/>
        <circle cx="4" cy="4" r="1.8" fill="white"/>
        <line x1="6.5" y1="7"   x2="13" y2="7"   stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="6.5" y1="10"  x2="12" y2="10"  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </g>

      {/* "Oson" matni */}
      <text x="62" y="44" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        fontWeight="800" fontSize="26" fill={textColor} letterSpacing="-0.5">
        Oson
      </text>
      {/* "Top" matni — yashil */}
      <text x="118" y="44" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        fontWeight="800" fontSize="26" fill="#16A34A" letterSpacing="-0.5">
        Top
      </text>
    </svg>
  );
}

export function OsonTopLogoFull({ width = 200 }) {
  // To'liq: icon ustida, quyida Oson+Top, slogan
  return (
    <svg
      width={width}
      height={width * 1.2}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gf1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>

      {/* ── ICON (markazda) ── */}
      <g transform="translate(40, 10)">
        {/* Tezlik chiziqlari */}
        <line x1="3"  y1="43" x2="18" y2="43" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" opacity="0.9"/>
        <line x1="5"  y1="54" x2="16" y2="54" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" opacity="0.65"/>
        <line x1="7"  y1="64" x2="18" y2="64" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" opacity="0.45"/>

        {/* Tutqi */}
        <path d="M36 34 C36 18 84 18 84 34" stroke="#15803D" strokeWidth="7" strokeLinecap="round" fill="none"/>

        {/* Sumka tanasi */}
        <rect x="18" y="32" width="82" height="72" rx="15" fill="url(#gf1)"/>

        {/* Katta odam — bosh */}
        <circle cx="46" cy="56" r="11" fill="white" opacity="0.95"/>
        {/* Katta odam — tana */}
        <path d="M24 104 C24 82 68 82 68 104" fill="white" opacity="0.95"/>

        {/* Kichik odam (bola) — bosh */}
        <circle cx="70" cy="62" r="8" fill="white" opacity="0.8"/>
        {/* Kichik odam — tana */}
        <path d="M56 104 C56 88 84 88 84 104" fill="white" opacity="0.8"/>

        {/* Narx tagi */}
        <g transform="translate(82, 24) rotate(-18)">
          <rect width="28" height="22" rx="6" fill="#F59E0B"/>
          <circle cx="7" cy="7" r="3" fill="white"/>
          <line x1="11" y1="13"  x2="25" y2="13"  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="11" y1="18"  x2="23" y2="18"  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </g>
      </g>

      {/* ── MATN ── */}
      {/* "Oson" */}
      <text x="24" y="158" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        fontWeight="900" fontSize="52" fill="#1a2332" letterSpacing="-1">
        Oson
      </text>
      {/* "Top" */}
      <text x="120" y="158" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        fontWeight="900" fontSize="52" fill="#16A34A" letterSpacing="-1">
        Top
      </text>

      {/* Chiziq + Slogan + Chiziq */}
      <line x1="18" y1="174" x2="52" y2="174" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="56" y="178" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        fontWeight="500" fontSize="13" fill="#16A34A" letterSpacing="0.2">
        Birga olamiz, birga tejaymiz!
      </text>
      <line x1="8" y1="174" x2="18" y2="174" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Favicon uchun (32x32, oddiy) ─────────────────────
export function OsonTopFavicon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#16A34A"/>
      <defs>
        <linearGradient id="gfav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E"/>
          <stop offset="100%" stopColor="#16A34A"/>
        </linearGradient>
      </defs>
      {/* Sumka */}
      <path d="M11 14 C11 9 21 9 21 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="5" y="13" width="22" height="16" rx="5" fill="white" opacity="0.9"/>
      {/* Odam bosh */}
      <circle cx="12" cy="18" r="3.5" fill="#16A34A"/>
      <path d="M6 29 C6 23 18 23 18 29" fill="#16A34A"/>
      {/* Tag */}
      <g transform="translate(19, 11) rotate(-15)">
        <rect width="9" height="7" rx="2" fill="#F59E0B"/>
        <circle cx="2.5" cy="2.5" r="1.2" fill="white"/>
      </g>
    </svg>
  );
}

export default OsonTopIcon;
