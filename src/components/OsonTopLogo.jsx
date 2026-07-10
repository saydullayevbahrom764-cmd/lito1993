// ─────────────────────────────────────────────────────
// OsonTop Logo — aniq SVG kodlash (rasmdan)
// Tuzilish: yashil sumka + oq katta odam + sariq bola
//           + sariq narx tagi + tezlik chiziqlari
// ─────────────────────────────────────────────────────

// ── Faqat icon (header, app icon uchun) ──────────────
export function OsonTopIcon({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bagG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="innerG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {/* ── Tezlik chiziqlari (chap) ── */}
      <line x1="2"  y1="42" x2="18" y2="42" stroke="#16A34A" strokeWidth="5"   strokeLinecap="round"/>
      <line x1="5"  y1="52" x2="17" y2="52" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="8"  y1="62" x2="18" y2="62" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>

      {/* ── Sumka tutqichi ── */}
      <path
        d="M34 34 C34 20 70 20 70 34"
        stroke="url(#bagG)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Sumka tanasi (yashil gradient) ── */}
      <rect x="18" y="32" width="62" height="56" rx="14" fill="url(#bagG)" />

      {/* ── Sumka pastki yumaloq ── */}
      <path
        d="M18 70 Q18 88 30 88 L70 88 Q82 88 82 70"
        fill="url(#innerG)"
        opacity="0.3"
      />

      {/* ── Katta odam (oq, chap) ── */}
      {/* Bosh */}
      <circle cx="41" cy="52" r="10" fill="white" />
      {/* Tana — pastga yumaloq */}
      <path
        d="M24 88 C24 70 58 70 58 88"
        fill="white"
      />

      {/* ── Kichik bola (sariq, o'ng) ── */}
      {/* Bosh */}
      <circle cx="60" cy="57" r="7" fill="#FBB614" />
      {/* Tana */}
      <path
        d="M49 88 C49 74 71 74 71 88"
        fill="#FBB614"
      />

      {/* ── Narx tagi (sariq, o'ng yuqori) ── */}
      <g transform="translate(66, 26) rotate(-15)">
        {/* Tag tanasi */}
        <path
          d="M0 4 C0 1.8 1.8 0 4 0 L22 0 L22 20 L4 20 C1.8 20 0 18.2 0 16 Z"
          fill="#FBB614"
        />
        {/* Tag tilchasi */}
        <path
          d="M22 0 L30 10 L22 20 Z"
          fill="#F59E0B"
        />
        {/* Tag teshigi */}
        <circle cx="5" cy="10" r="2.5" fill="#16A34A" />
        {/* Tag chiziqlari */}
        <line x1="9" y1="6"  x2="20" y2="6"  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="10" x2="20" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="14" x2="17" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// ── Gorizontal: icon + OsonTop matni ─────────────────
export function OsonTopLogoHorizontal({ width = 160, dark = false }) {
  const textDark = dark ? "#FFFFFF" : "#1A2332";
  const h = width * 0.38;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 220 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hbagG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>

      {/* Tezlik chiziqlari */}
      <line x1="2"  y1="36" x2="14" y2="36" stroke="#16A34A" strokeWidth="4"   strokeLinecap="round"/>
      <line x1="4"  y1="44" x2="13" y2="44" stroke="#16A34A" strokeWidth="3"   strokeLinecap="round" opacity="0.7"/>
      <line x1="6"  y1="52" x2="14" y2="52" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>

      {/* Sumka tutqichi */}
      <path d="M26 28 C26 18 52 18 52 28" stroke="url(#hbagG)" strokeWidth="5.5" strokeLinecap="round" fill="none"/>

      {/* Sumka tanasi */}
      <rect x="14" y="26" width="48" height="44" rx="11" fill="url(#hbagG)"/>

      {/* Katta odam — bosh */}
      <circle cx="31" cy="40" r="7.5" fill="white"/>
      {/* Katta odam — tana */}
      <path d="M18 70 C18 57 44 57 44 70" fill="white"/>

      {/* Kichik bola — bosh */}
      <circle cx="46" cy="44" r="5.5" fill="#FBB614"/>
      {/* Kichik bola — tana */}
      <path d="M37 70 C37 60 55 60 55 70" fill="#FBB614"/>

      {/* Narx tagi */}
      <g transform="translate(52, 18) rotate(-15)">
        <path d="M0 3.5 C0 1.6 1.6 0 3.5 0 L18 0 L18 16 L3.5 16 C1.6 16 0 14.4 0 12.5 Z" fill="#FBB614"/>
        <path d="M18 0 L24 8 L18 16 Z" fill="#F59E0B"/>
        <circle cx="4" cy="8" r="2" fill="#16A34A"/>
        <line x1="7" y1="5"  x2="16" y2="5"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="8"  x2="16" y2="8"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </g>

      {/* "Oson" matni — qora */}
      <text
        x="74" y="52"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="32"
        fill={textDark}
        letterSpacing="-0.5"
      >Oson</text>

      {/* "Top" matni — yashil */}
      <text
        x="148" y="52"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="32"
        fill="#16A34A"
        letterSpacing="-0.5"
      >Top</text>
    </svg>
  );
}

// ── To'liq logo (splash, about sahifalari uchun) ─────
export function OsonTopLogoFull({ width = 220 }) {
  const h = Math.round(width * 1.15);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 220 252"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fbagG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="fbagG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {/* ── ICON (markazda, katta) ── */}
      <g transform="translate(30, 0)">
        {/* Tezlik chiziqlari */}
        <line x1="2"  y1="50" x2="22" y2="50" stroke="#16A34A" strokeWidth="6"   strokeLinecap="round"/>
        <line x1="5"  y1="62" x2="20" y2="62" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" opacity="0.7"/>
        <line x1="8"  y1="74" x2="22" y2="74" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" opacity="0.5"/>

        {/* Sumka tutqichi */}
        <path d="M38 40 C38 22 88 22 88 40" stroke="url(#fbagG)" strokeWidth="9" strokeLinecap="round" fill="none"/>

        {/* Sumka tanasi */}
        <rect x="20" y="38" width="80" height="72" rx="18" fill="url(#fbagG)"/>

        {/* Pastki qoʻshimcha gradient */}
        <path d="M20 88 Q20 110 34 110 L86 110 Q100 110 100 88" fill="url(#fbagG2)" opacity="0.25"/>

        {/* Katta odam — bosh */}
        <circle cx="50" cy="60" r="13" fill="white"/>
        {/* Katta odam — tana */}
        <path d="M28 110 C28 88 72 88 72 110" fill="white"/>

        {/* Kichik bola — bosh */}
        <circle cx="75" cy="68" r="9" fill="#FBB614"/>
        {/* Kichik bola — tana */}
        <path d="M62 110 C62 95 88 95 88 110" fill="#FBB614"/>

        {/* Narx tagi */}
        <g transform="translate(86, 28) rotate(-15)">
          <path d="M0 5.5 C0 2.5 2.5 0 5.5 0 L28 0 L28 25 L5.5 25 C2.5 25 0 22.5 0 19.5 Z" fill="#FBB614"/>
          <path d="M28 0 L37 12.5 L28 25 Z" fill="#F59E0B"/>
          <circle cx="6" cy="12.5" r="3" fill="#16A34A"/>
          <line x1="11" y1="7"  x2="26" y2="7"  stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="11" y1="12.5" x2="26" y2="12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="11" y1="18" x2="22" y2="18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </g>
      </g>

      {/* ── MATN ── */}
      {/* "Oson" — qora */}
      <text
        x="12" y="168"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="58"
        fill="#1A2332"
        letterSpacing="-1"
      >Oson</text>
      {/* "Top" — yashil */}
      <text
        x="127" y="168"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="58"
        fill="#16A34A"
        letterSpacing="-1"
      >Top</text>

      {/* ── Slogan ── */}
      {/* Chap chiziq */}
      <line x1="10" y1="186" x2="40" y2="186" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Matn */}
      <text
        x="44" y="190"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="500"
        fontSize="13.5"
        fill="#16A34A"
        letterSpacing="0.3"
      >Birga olamiz, birga sotamiz!</text>
      {/* O'ng chiziq */}
      <line x1="182" y1="186" x2="212" y2="186" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── App icon versiyasi (yashil fon, rounded square) ──
export function OsonTopAppIcon({ size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="appBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="appBag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {/* Yashil fon */}
      <rect width="60" height="60" rx="14" fill="url(#appBg)"/>

      {/* Tezlik chiziqlari */}
      <line x1="3"  y1="28" x2="13" y2="28" stroke="white" strokeWidth="3"   strokeLinecap="round"/>
      <line x1="5"  y1="34" x2="12" y2="34" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.7"/>
      <line x1="6"  y1="40" x2="13" y2="40" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>

      {/* Sumka tutqichi */}
      <path d="M22 22 C22 14 42 14 42 22" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"/>

      {/* Sumka tanasi — oq */}
      <rect x="12" y="20" width="36" height="30" rx="8" fill="white" opacity="0.95"/>

      {/* Katta odam bosh — yashil */}
      <circle cx="26" cy="29" r="6" fill="#16A34A"/>
      {/* Katta odam tana */}
      <path d="M14 50 C14 40 38 40 38 50" fill="#16A34A"/>

      {/* Kichik bola bosh — sariq */}
      <circle cx="38" cy="33" r="4.5" fill="#FBB614"/>
      {/* Kichik bola tana */}
      <path d="M30 50 C30 43 46 43 46 50" fill="#FBB614"/>

      {/* Narx tagi */}
      <g transform="translate(38, 14) rotate(-15)">
        <path d="M0 2.5 C0 1.1 1.1 0 2.5 0 L13 0 L13 11 L2.5 11 C1.1 11 0 9.9 0 8.5 Z" fill="#FBB614"/>
        <path d="M13 0 L18 5.5 L13 11 Z" fill="#F59E0B"/>
        <circle cx="3" cy="5.5" r="1.5" fill="#16A34A"/>
      </g>
    </svg>
  );
}

export default OsonTopIcon;
