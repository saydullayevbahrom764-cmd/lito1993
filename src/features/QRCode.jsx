import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

// QR kod generatsiya (SVG asosida)
function generateQRMatrix(text) {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  // Burchak markerlar
  [[0,0],[0,14],[14,0]].forEach(([r,c]) => {
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      if (i===0||i===6||j===0||j===6||(i>=2&&i<=4&&j>=2&&j<=4))
        if (r+i<size && c+j<size) matrix[r+i][c+j] = 1;
    }
  });
  // Ma'lumot qismi (xash asosida)
  const hash = text.split("").reduce((a,c) => ((a<<5)-a)+c.charCodeAt(0)|0, 0);
  for (let r = 8; r < size; r++) {
    for (let c = 8; c < size; c++) {
      matrix[r][c] = Math.abs((hash * (r+1) * (c+1)) % 3) === 0 ? 1 : 0;
    }
  }
  return matrix;
}

export function QRCodeSVG({ text, size = 160, color = G, bg = "#fff" }) {
  const matrix = generateQRMatrix(text);
  const cellSize = size / matrix.length;
  return (
    <svg width={size} height={size} style={{ background:bg, borderRadius:12, padding:8 }}>
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect key={`${r}-${c}`}
              x={c * cellSize} y={r * cellSize}
              width={cellSize} height={cellSize}
              fill={color} rx={cellSize * 0.15}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function QRModal({ listing, lang, dark, onClose }) {
  const th = theme(dark);
  const tx = T[lang];
  const [copied, setCopied] = useState(false);
  const url = `https://osontop.uz/listing/${listing.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    navigator.share?.({
      title: listing.title,
      text: lang==="uz"
        ? `OsonTop da "${listing.title}" e'lonini ko'ring`
        : `Посмотрите объявление "${listing.title}" на OsonTop`,
      url,
    });
  };

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`📱 ${lang==="uz" ? "QR Kod" : "QR Код"}`}>
      <div style={{ textAlign:"center", padding:"8px 0 20px" }}>
        {/* QR kod */}
        <div style={{ display:"inline-block", background:"#fff", borderRadius:20, padding:12, boxShadow:th.shadow, marginBottom:16, border:`3px solid ${G}20` }}>
          <QRCodeSVG text={url} size={180} color={G} bg="#fff" />
        </div>

        {/* E'lon ma'lumoti */}
        <div style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:4 }}>
          {listing.title}
        </div>
        <div style={{ fontSize:12, color:th.sub, marginBottom:20 }}>
          {lang==="uz" ? "Skanlab darhol oching" : "Отсканируйте для просмотра"}
        </div>

        {/* URL */}
        <div style={{
          background:th.card2, borderRadius:12, padding:"10px 14px",
          display:"flex", alignItems:"center", gap:8, marginBottom:16,
          border:`1px solid ${th.border}`,
        }}>
          <span style={{ flex:1, fontSize:11, color:th.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"left" }}>
            {url}
          </span>
          <button onClick={handleCopy} style={{
            background: copied ? G : th.card3, border:"none",
            borderRadius:8, padding:"5px 10px", fontSize:11,
            fontWeight:700, color: copied ? "#fff" : th.text, cursor:"pointer",
            flexShrink:0,
          }}>
            {copied ? "✓" : lang==="uz" ? "Nusxa" : "Копировать"}
          </button>
        </div>

        {/* Foydalanish misollari */}
        <div style={{ background:G+"08", borderRadius:12, padding:"12px 14px", marginBottom:20, textAlign:"left", border:`1px solid ${G}15` }}>
          <div style={{ fontSize:12, fontWeight:700, color:G, marginBottom:8 }}>
            {lang==="uz" ? "💡 Qayerda ishlatish mumkin?" : "💡 Где можно использовать?"}
          </div>
          {(lang==="uz"
            ? ["Do'kon vitrinasiga joylashtiring","Vizit kartaga chop eting","Ijtimoiy tarmoqlarda ulashing","Do'stlaringizga yuboring"]
            : ["Разместите в витрине магазина","Напечатайте на визитке","Поделитесь в соцсетях","Отправьте друзьям"]
          ).map((tip,i) => (
            <div key={i} style={{ display:"flex", gap:6, marginBottom:4, alignItems:"center" }}>
              <span style={{ color:G, fontSize:12 }}>✓</span>
              <span style={{ fontSize:12, color:th.text }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:10 }}>
          <Btn dark={dark} onClick={handleShare} style={{ flex:1, background:G }}>
            🔗 {lang==="uz" ? "Ulashish" : "Поделиться"}
          </Btn>
          <Btn dark={dark} onClick={handleCopy} variant="ghost" style={{ flex:1 }}>
            📋 {lang==="uz" ? "Nusxa" : "Скопировать"}
          </Btn>
        </div>
      </div>
    </ModalSheet>
  );
}

// ── E'lon kartochkasida mini QR tugma ─────────────────
export function QRButton({ listing, lang, dark }) {
  const [show, setShow] = useState(false);
  const th = theme(dark);
  return (
    <>
      <button onClick={() => setShow(true)} style={{
        background: th.card2, border:`1px solid ${th.border}`,
        borderRadius:8, padding:"6px 10px", fontSize:12,
        fontWeight:600, color:th.text, cursor:"pointer",
        display:"flex", alignItems:"center", gap:4,
      }}>
        <span>📱</span>
        <span style={{ fontSize:11 }}>QR</span>
      </button>
      {show && <QRModal listing={listing} lang={lang} dark={dark} onClose={() => setShow(false)} />}
    </>
  );
}
