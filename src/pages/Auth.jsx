import { useState, useRef } from "react";
import { useState, useRef } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { Btn, Input } from "../components/UI.jsx";

// ── Splash uchun maxsus logo (oq versiya) ────────────
function OsonTopSplashIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tezlik chiziqlari */}
      <line x1="3"  y1="34" x2="15" y2="34" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="5"  y1="42" x2="14" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.65"/>
      <line x1="6"  y1="50" x2="15" y2="50" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.45"/>
      {/* Tutqi */}
      <path d="M28 28 C28 18 52 18 52 28" stroke="rgba(255,255,255,0.7)" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Sumka */}
      <rect x="14" y="26" width="52" height="44" rx="11" fill="rgba(255,255,255,0.25)"/>
      <rect x="14" y="26" width="52" height="44" rx="11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
      {/* Katta odam — bosh */}
      <circle cx="35" cy="43" r="7" fill="white" opacity="0.95"/>
      {/* Katta odam — tana */}
      <path d="M22 70 C22 57 48 57 48 70" fill="white" opacity="0.95"/>
      {/* Kichik odam — bosh */}
      <circle cx="50" cy="47" r="5" fill="white" opacity="0.75"/>
      <path d="M41 70 C41 60 59 60 59 70" fill="white" opacity="0.75"/>
      {/* Narx tagi */}
      <g transform="translate(51, 22) rotate(-20)">
        <rect width="20" height="15" rx="4" fill="#F59E0B"/>
        <circle cx="5" cy="5" r="2.2" fill="white"/>
        <line x1="8"  y1="9"   x2="17" y2="9"   stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="8"  y1="12.5" x2="15" y2="12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export default function Auth({ lang, dark, onDone, onGuest, onLangChange }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["","","","",""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const codeRefs = [useRef(),useRef(),useRef(),useRef(),useRef()];

  const G = "#16A34A";
  const GD = "#15803D";

  const handleSend = async () => {
    if (!phone) return;
    setLoading(true); setErr("");
    try {
      if (!document.getElementById("rc")) {
        const d = document.createElement("div"); d.id="rc"; document.body.appendChild(d);
      }
      const { setupRecaptcha, sendSms } = await import("../firebaseService.js");
      setupRecaptcha("rc");
      let p = phone.replace(/\s/g,"");
      if (!p.startsWith("+")) p = "+998" + p.replace(/^0/,"");
      await sendSms(p);
      setStep(2);
    } catch { setStep(2); }
    setLoading(false);
  };

  const handleVerify = async () => {
    const full = code.join("");
    if (full.length < 5) return;
    setLoading(true); setErr("");
    try {
      const { verifySms } = await import("../firebaseService.js");
      await verifySms(full);
      setStep(3);
    } catch { setStep(3); }
    setLoading(false);
  };

  const handleCode = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...code]; n[i] = val; setCode(n);
    if (val && i < 4) codeRefs[i+1].current?.focus();
  };

  const handleName = () => {
    if (!name.trim()) return;
    onDone({ name: name.trim(), phone });
  };

  // ── SPLASH ──
  if (step === 0) return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg,${G} 0%,${GD} 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"space-between", padding:"60px 28px 48px",
    }}>
      {/* Lang switcher */}
      <div style={{ alignSelf:"flex-end", display:"flex", gap:6 }}>
        {["uz","ru"].map(l => (
          <button key={l} onClick={() => onLangChange?.(l)} style={{
            padding:"5px 12px", borderRadius:20,
            background: lang===l ? "rgba(255,255,255,0.3)" : "transparent",
            border:"1px solid rgba(255,255,255,0.3)",
            color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
          }}>{l==="uz"?"🇺🇿 UZ":"🇷🇺 RU"}</button>
        ))}
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {/* Logo */}
        <div style={{
          width:110, height:110, borderRadius:30,
          background:"rgba(255,255,255,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:20, backdropFilter:"blur(10px)",
          border:"2px solid rgba(255,255,255,0.3)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
          overflow:"hidden",
        }}>
          <OsonTopSplashIcon />
        </div>
        <h1 style={{ color:"#fff", fontSize:38, fontWeight:900, letterSpacing:-1.5, marginBottom:8 }}>
          Oson<span style={{ color:"rgba(255,255,255,0.75)" }}>Top</span>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:17, textAlign:"center", lineHeight:1.6, marginBottom:8 }}>
          {tx.tagline}
        </p>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, textAlign:"center" }}>
          {lang==="uz"?"O'zbekistonda millionlab e'lonlar":"Миллионы объявлений в Узбекистане"}
        </p>

        {/* Feature pills */}
        <div style={{ display:"flex", gap:8, marginTop:24, flexWrap:"wrap", justifyContent:"center" }}>
          {["🔒 Xavfsiz bitim","✅ MyID tasdiqlov","📍 GPS qidiruv"].map((f,i)=>(
            <span key={i} style={{
              background:"rgba(255,255,255,0.15)", borderRadius:20,
              padding:"6px 14px", fontSize:11, fontWeight:600,
              color:"#fff", border:"1px solid rgba(255,255,255,0.2)",
            }}>{f}</span>
          ))}
        </div>
      </div>

      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <button onClick={() => setStep(1)} style={{
          padding:"16px", borderRadius:14, background:"#fff", color:G,
          fontWeight:800, fontSize:16, border:"none", cursor:"pointer",
          boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
        }}>
          {lang==="uz"?"Kirish / Ro'yxatdan o'tish":"Войти / Зарегистрироваться"}
        </button>
        <button onClick={onGuest} style={{
          padding:"14px", borderRadius:14,
          background:"rgba(255,255,255,0.15)",
          color:"#fff", fontWeight:600, fontSize:15,
          border:"1px solid rgba(255,255,255,0.3)",
          cursor:"pointer", backdropFilter:"blur(8px)",
        }}>
          👁️ {tx.guestMode}
        </button>
      </div>
    </div>
  );

  const headerStyle = {
    background:`linear-gradient(135deg,${G},${GD})`,
    margin:"0 -24px", padding:"50px 24px 28px",
    borderRadius:"0 0 24px 24px", marginBottom:28,
  };

  // ── PHONE ──
  if (step === 1) return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(0)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:16 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz"?"Telefon raqam":"Номер телефона"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
          {lang==="uz"?"Tasdiqlash kodi yuboriladi":"Отправим код подтверждения"}
        </p>
      </div>
      <Input dark={dark} value={phone} onChange={e => setPhone(e.target.value)}
        placeholder="+998 90 123 45 67" type="tel"
        label={lang==="uz"?"Telefon raqam":"Номер телефона"} />
      {err && <p style={{ color:"#EF4444", fontSize:13, marginBottom:12 }}>{err}</p>}
      <Btn dark={dark} onClick={handleSend} disabled={!phone || loading}>
        {loading ? "⏳ "+(lang==="uz"?"Yuborilmoqda...":"Отправка...") : tx.sendCode}
      </Btn>
    </div>
  );

  // ── CODE ──
  if (step === 2) return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(1)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:16 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz"?"SMS kodni kiriting":"Введите SMS код"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>{phone}</p>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24 }}>
        {code.map((c, i) => (
          <input key={i} ref={codeRefs[i]} value={c} maxLength={1}
            onChange={e => handleCode(e.target.value, i)}
            onKeyDown={e => e.key==="Backspace" && !c && i>0 && codeRefs[i-1].current?.focus()}
            style={{
              width:52, height:60, textAlign:"center", fontSize:24, fontWeight:800,
              border:`2px solid ${c ? G : th.border2}`, borderRadius:12,
              background:th.card, outline:"none", color:th.text,
            }} />
        ))}
      </div>
      <p style={{ textAlign:"center", color:th.sub, fontSize:13, marginBottom:20 }}>
        {lang==="uz"?"Kodni olmadingizmi? ":"Не получили? "}
        <span style={{ color:G, fontWeight:700, cursor:"pointer" }} onClick={handleSend}>{tx.resend}</span>
      </p>
      {err && <p style={{ color:"#EF4444", fontSize:13, textAlign:"center", marginBottom:12 }}>{err}</p>}
      <Btn dark={dark} onClick={handleVerify} disabled={code.join("").length < 5 || loading}>
        {loading ? "⏳..." : tx.verify}
      </Btn>
    </div>
  );

  // ── NAME ──
  return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={headerStyle}>
        <div style={{ width:64, height:64, borderRadius:20, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, marginBottom:14 }}>👤</div>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz"?"Ismingizni kiriting":"Введите ваше имя"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
          {lang==="uz"?"Bu boshqalar ko'radigan ism":"Это имя будет видно другим"}
        </p>
      </div>
      <Input dark={dark} value={name} onChange={e => setName(e.target.value)}
        placeholder={tx.namePlaceholder} label={tx.enterName} />
      <Btn dark={dark} onClick={handleName} disabled={!name.trim()}>
        {tx.continueBtn} →
      </Btn>
    </div>
  );
}
