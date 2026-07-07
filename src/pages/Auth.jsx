import { useState, useRef } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { Btn, Input } from "../components/UI.jsx";

export default function Auth({ lang, dark, onDone, onGuest }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0); // 0=splash, 1=phone, 2=code, 3=name
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["","","","",""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const codeRefs = [useRef(),useRef(),useRef(),useRef(),useRef()];

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
    } catch {
      setStep(2); // demo
    }
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
    } catch {
      setStep(3); // demo
    }
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
      minHeight:"100vh", background:"linear-gradient(160deg,#5B2D8E 0%,#3A1A6E 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"space-between", padding:"60px 28px 48px",
    }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{
          width:90, height:90, borderRadius:24, background:"rgba(255,255,255,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:20, backdropFilter:"blur(10px)",
          border:"1px solid rgba(255,255,255,0.2)",
        }}>
          <span style={{ fontSize:48 }}>🛍️</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:34, fontWeight:900, letterSpacing:-1, marginBottom:10 }}>BirBir</h1>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:16, textAlign:"center", lineHeight:1.6 }}>
          {tx.tagline}
        </p>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, textAlign:"center", marginTop:12 }}>
          {lang==="uz" ? "O'zbekistonda eng qulay e'lonlar" : "Лучшая площадка объявлений в Узбекистане"}
        </p>
      </div>
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <button onClick={() => setStep(1)} style={{
          padding:"16px", borderRadius:14, background:"#fff", color:"#5B2D8E",
          fontWeight:800, fontSize:16, border:"none", cursor:"pointer",
          boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
        }}>
          {lang==="uz" ? "Kirish / Ro'yxatdan o'tish" : "Войти / Зарегистрироваться"}
        </button>
        <button onClick={onGuest} style={{
          padding:"14px", borderRadius:14, background:"rgba(255,255,255,0.15)",
          color:"#fff", fontWeight:600, fontSize:15, border:"1px solid rgba(255,255,255,0.3)",
          cursor:"pointer", backdropFilter:"blur(8px)",
        }}>
          👁️ {tx.guestMode}
        </button>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:4 }}>
          {["uz","ru"].map(l => (
            <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,0.4)", cursor:"pointer" }}
              onClick={() => {}}>
              {l==="uz" ? "🇺🇿 O'zbek" : "🇷🇺 Русский"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PHONE ──
  if (step === 1) return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={{
        background:"linear-gradient(135deg,#5B2D8E,#3A1A6E)",
        margin:"0 -24px", padding:"50px 24px 28px",
        borderRadius:"0 0 24px 24px", marginBottom:28,
      }}>
        <button onClick={() => setStep(0)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:16 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz" ? "Telefon raqam" : "Номер телефона"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
          {lang==="uz" ? "Tasdiqlash kodi yuboriladi" : "Отправим код подтверждения"}
        </p>
      </div>
      <Input dark={dark} value={phone} onChange={e => setPhone(e.target.value)}
        placeholder="+998 90 123 45 67" type="tel"
        label={lang==="uz" ? "Telefon raqam" : "Номер телефона"} />
      {err && <p style={{ color:"#E74C3C", fontSize:13, marginBottom:12 }}>{err}</p>}
      <Btn dark={dark} onClick={handleSend} disabled={!phone || loading}>
        {loading ? "⏳ " + (lang==="uz" ? "Yuborilmoqda..." : "Отправка...") : tx.sendCode}
      </Btn>
    </div>
  );

  // ── CODE ──
  if (step === 2) return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={{
        background:"linear-gradient(135deg,#5B2D8E,#3A1A6E)",
        margin:"0 -24px", padding:"50px 24px 28px",
        borderRadius:"0 0 24px 24px", marginBottom:28,
      }}>
        <button onClick={() => setStep(1)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:16 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz" ? "SMS kodni kiriting" : "Введите SMS код"}
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
              border:`2px solid ${c ? "#5B2D8E" : th.border2}`, borderRadius:12,
              background:th.card, outline:"none", color:th.text,
            }} />
        ))}
      </div>
      <p style={{ textAlign:"center", color:th.sub, fontSize:13, marginBottom:20 }}>
        {lang==="uz" ? "Kodni olmadingizmi? " : "Не получили? "}
        <span style={{ color:"#5B2D8E", fontWeight:700, cursor:"pointer" }} onClick={handleSend}>
          {tx.resend}
        </span>
      </p>
      {err && <p style={{ color:"#E74C3C", fontSize:13, textAlign:"center", marginBottom:12 }}>{err}</p>}
      <Btn dark={dark} onClick={handleVerify} disabled={code.join("").length < 5 || loading}>
        {loading ? "⏳..." : tx.verify}
      </Btn>
    </div>
  );

  // ── NAME ──
  return (
    <div style={{ minHeight:"100vh", background:th.bg, padding:"0 24px" }}>
      <div style={{
        background:"linear-gradient(135deg,#5B2D8E,#3A1A6E)",
        margin:"0 -24px", padding:"50px 24px 28px",
        borderRadius:"0 0 24px 24px", marginBottom:28,
      }}>
        <div style={{ width:64, height:64, borderRadius:20, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, marginBottom:14 }}>👤</div>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:6 }}>
          {lang==="uz" ? "Ismingizni kiriting" : "Введите ваше имя"}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
          {lang==="uz" ? "Bu boshqalar ko'radigan ism" : "Это имя будет видно другим"}
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
